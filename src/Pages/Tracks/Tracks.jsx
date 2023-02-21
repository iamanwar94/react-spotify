import React, {useState, useEffect} from 'react'
import axios from 'axios'

const userIdFromLocal = () => {
  let data = localStorage.getItem("userId");
  if (data) return data;
  else return null
}

const playlistIdFromLocal = () => {
  let data = localStorage.getItem("playlistId");
  if (data) return data;
  else return null
}

const Tracks = ({token, setToken}) => {
  const [searchKey, setSearchKey] = useState("")
  const [searchedTracks, setSearchedTracks] = useState([])
  const [tracks, setTracks] = useState([])
  const [playlistId, setPlaylistId] = useState(playlistIdFromLocal())
  const [userId, setUserId] = useState(userIdFromLocal())


  useEffect(() => {
    !userId && getUserId();
    !playlistId && getPlaylistId();
  }, [])

  useEffect(() => {
    tracks.length === 0 && getTracks()
  }, [])

  const getUserId = async () => {
    const {data} = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    setUserId(data?.id)
    localStorage.setItem("userId", data?.id)
  }

  const getPlaylistId = async () => {
    const {data} = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    console.log("playlsit", data.items[0].id);
    setPlaylistId(data.items[0].id)
    localStorage.setItem("playlistId", data.items[0].id)
  }

  const getTracks = async () => {
    const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 6,
      }
    })
    setTracks(data?.items)
  }

  const searchTracks = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: searchKey,
            type: "track"
        }
    })

    setSearchedTracks(data.tracks.items)
  }

  const saveTrack = async (uri) => {
    let formData = {
      uris:[uri],
      position:0
    }
    const {data} = await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, JSON.stringify(formData),{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    if(data){
      getTracks()
    }
  }

  const deleteTrack = async (uri) => {
    let formData = {tracks: [{uri:uri}]}
    const {data} = await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(formData)
    })

    if(data){
      getTracks()
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem("token")
  }

  const Tracks = () => {
    return (
      <>
        {
          searchedTracks.length ? 
          searchedTracks?.map((track, i)=> (
            <div className="flex justify-center mt-2 mb-2" key={i}>
              <div
                className="flex rounded-lg bg-white shadow-lg dark:bg-neutral-700 md:max-w-xl md:flex-row h-28">
                <img
                  className="w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                  src={track.album.images[0].url}
                  alt={track.album.name} />
                <div className="flex flex-col justify-start px-4 w-96 rounded">
                  <h5
                    className="mb-1 text-neutral-800 dark:text-neutral-50">
                    Title: {track.album.name}
                  </h5>
                  <p>
                    Artist: {track.artists[0].name}
                  </p>
                  <div className="flex items-center gap-4 justify-between">
                  <p className='p-0 m-0 mt-6'>
                    <a href={track.preview_url} target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 rounded-full p-1 flex justify-center items-center border border-slate-100 shadow-xl hover:w-7 hover:h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    </a>
                  </p>
                  <p className="p-0 m-0 mt-6" onClick={()=> saveTrack(track.uri)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 rounded-full p-1 flex justify-center items-center border border-slate-100 shadow-xl hover:w-7 hover:h-7 hover:cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  </p>
                  </div>
                </div>
              </div>
            </div>
          )) : 
          tracks?.map((track, i)=> (
            <div className="flex justify-center mt-2 mb-2" key={i}>
              <div
                className="flex rounded-lg bg-white shadow-lg dark:bg-neutral-700 md:max-w-xl md:flex-row h-28">
                <img
                  className="w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                  src={track.track.album.images[0].url}
                  alt={track.track.album.name} />
                <div className="flex flex-col justify-start px-4 w-96 rounded">
                  <h5
                    className="mb-1 text-neutral-800 dark:text-neutral-50">
                    Title: {track.track.album.name}
                  </h5>
                  <p>
                    Artist: {track.track.artists[0].name}
                  </p>
                  <div className="flex items-center gap-4 justify-between">
                  <p className='p-0 m-0 mt-6'>
                    <a href={track.track.preview_url} target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 rounded-full p-1 flex justify-center items-center border border-slate-100 shadow-xl hover:w-7 hover:h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    </a>
                  </p>
                  <p className="p-0 m-0 mt-6" onClick={()=> deleteTrack(track.track.uri)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 rounded-full p-1 flex justify-center items-center border border-slate-100 shadow-xl hover:w-7 hover:h-7 hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </>
    )
  }

  return (
    <div className='h-[100vh] w-full flex items-center flex-col justify-start'>
      <div className="heading m-0 mt-4 text-2xl">React Spotify App</div>
      <div className="flex justify-center mt-6">
          <div className="mb-3 xl:w-96">
            <form className="relative mb-4 flex w-full flex-wrap items-stretch" onSubmit={searchTracks}>
              <input
                type="search"
                className="relative m-0 -mr-px block w-[1%] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary-600 focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon3"
                onChange={e => setSearchKey(e.target.value)}
                />
              <button
                className="relative z-[2] rounded-r border-2 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
                type="submit"
                id="button-addon3"
                data-te-ripple-init>
                Search
              </button>
            </form>
          </div>
      </div>
      <div className="mt-1">
      <Tracks />
      </div>
    </div>
  )
}

export default Tracks