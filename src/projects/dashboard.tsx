import { useEffect, useState } from "react"

interface TableData{
  Nation : string ,
  "ID Nation" : string ,
  "ID Year" : string ,
  Population : number ,
  Year : string 
}


function Dashboard(){
  const [data , setData] = useState<TableData[] | []>([])
  const [renderData , setRenderData] = useState<TableData [] | []>([])
  const [prev , setPrev] = useState<TableData[] | []>([])
  const [query , setQuery] = useState("")

  
  useEffect(()=>{

      async function fetchData(){
        const response = await fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population')  
        const format = await response.json()
        setData(format.data)
        setRenderData(format.data)
        setPrev(format.data)
      }

      fetchData()

    }, [])

    const handleDelete = (population : number) => () : void => {
      const updatedArr = renderData.filter(( item : TableData  )=>{
        return item.Population !==  population
      })
      setRenderData(updatedArr) 

      const updatedPrev = prev.filter(( item : TableData ) => {
        return item.Population  !== population  
      })
      setPrev(updatedPrev)
    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value)
    }

    useEffect(()=>{
        
        let timer = setTimeout(()=>{
          console.log(query)
          
          if(query.length > 0){ 

            const queryResult = prev.filter((item )=>{
              return item.Year.includes(query)
            })
            setRenderData(queryResult) 
          }

          if(data.length > 0 && query.length < 1){
            console.log(data.length , query.length)
            setRenderData(prev)
            console.log(prev)
          }


        }, 300)    
      
      return ()=>{ clearTimeout(timer) }

    } , [query])


  return <div className="w-4/5 mx-auto p-2 mt-10">

    <div className="flex justify-between my-2 items-center">

    <div className=" px-4 border shadow rounded-md border-zinc-200 focus:outline-indigo-300 flex ">
      <input type="text"
      placeholder="Search for Year" 
      onChange={ (e)=>{ handleChange(e) }}
      value={query}
      className="outline-none p-1"/>
      {
        query && <button className="text-zinc-500 " onClick={()=>setQuery("")}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></button>
      }
    </div>

    <button 
      onClick={()=>{ setRenderData(data) ; setPrev(data) }} 
      className="border  border-zinc-200 shadow text-zinc-600 p-1 text-sm px-4 rounded-md">Reset</button>
    </div>

      <table className="w-full overflow-hidden mx-auto shadow-md border border-zinc-200 p-2 rounded-md">
        <thead>
          <tr className="p-2 text-zinc-500 text-sm bg-zinc-100">
            <th className="p-2 ">Nation</th>
            <th className="p-2 ">Nation ID</th>
            <th className="p-2 ">ID Year</th>
            <th className="p-2 ">Year</th>
            <th className="p-2 ">Population</th>
            <th className="p-2 ">Action</th>
          </tr>
        </thead>
        <tbody className="">
          {
            renderData?.map((item  , index : number )=>{
              return <tr key={index} className="p-2 border-b border-zinc-200 text-sm hover:bg-stone-50">
                <td className="p-2 text-center">{item.Nation}</td>
                <td className="p-2 text-center">{item['ID Nation']}</td>
                <td className="p-2 text-center">{item['ID Year']}</td>
                <td className="p-2 text-center">{item.Year}</td>
                <td className="p-2 text-center ">{item.Population}</td>
                <td className="p-2 text-center">
                  <button 
                  className="p-1 px-3 rounded-md text-red-400 " 
                  onClick={handleDelete(item.Population)}>delete</button>
                </td>
              </tr>
            })
          }
            <tr></tr>
        </tbody>
      </table>
        <p className="text-sm mt-2 text-zinc-400">Total { renderData.length }</p>

  </div>

}

export default Dashboard ;