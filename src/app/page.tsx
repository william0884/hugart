import Image from 'next/image'

export default function Home() {

  
  return (
    <div className="w-full  max-w-xs ml-10">

    <form className="bg-gray-700 pl-0 shadow-md rounded px-8 pt-6 pb-8 mb-4" action="/api/hug" method="post">
    <div className="mb-4"></div>
    <h1 className="block border-2 text-center text-white text-sm font-bold mb-2">HugArt</h1>
    <p>Fill in the form with a sentence. Replace suggestion area with [MASK].</p>

    <label className="block text-white text-sm font-bold mb-2" htmlFor="input">Input:</label>

<input className="block border-2 border-gray-300 w-full text-gray-500 text-sm font-bold mb-2" type="text" id="input" name="input"/>


      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
      type="submit">Submit</button>
    </form>

    </div>

  )
}



