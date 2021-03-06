import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useSearchParams } from "react-router-dom"
import { FiPlay, FiPlayCircle } from "react-icons/fi"
import Button from "../components/Button"
import fetchData from "../fetchData"

const Search = () => {
  const apiUrl = "https://icanhazdadjoke.com/search"
  const [searchParams, setsearchParams] = useSearchParams()
  const [data, setdata] = useState({})
  const [jokes, setjokes] = useState([])
  const [page, setpage] = useState(1)
  const [keyword, setkeyword] = useState(searchParams.get('s'))

  let jokeIndex = 0

  const quoted = (str) => {
    return str.startsWith('"') && str.endsWith('"') ? true : false
  }

  const getJokes = async (term) => {
    await fetchData(`${apiUrl}?${new URLSearchParams({
      term: term,
      limit: 20,
      page: page,
    })}`)
    .then(result => {
      if (result.status === 200) {
        setdata(result)
      }
    })
  }

  useEffect(() => {
    setkeyword(searchParams.get('s'))
    setjokes([])
    setpage(1)
  }, [searchParams])

  useEffect(() => {
    getJokes(keyword)
  }, [keyword, page])

  useEffect(() => {
    if (data.results) {
      setjokes(jokes)
      jokes.push(...data.results)
      setjokes([...jokes])
    }
    if (data.current_page) setpage(data.current_page)
  }, [data])
  
  return (
    <>
      <Helmet>
        <title>Daddj | Search Results</title>
      </Helmet>
      <div className="content">
      <h2>Found {data ? data.total_jokes : 0} results {keyword !== '' ? `for "${keyword}"` : ''}</h2>
        <div className="flex flex-col"> {/* Search Results */}
          {jokes ? jokes.map(joke => {
            jokeIndex++
            return(
              <div key={joke.id}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-[10px]">
                  <h6 className="text-center sm:text-left text-daddj-700">{quoted(joke.joke) ? joke.joke : `"${joke.joke}"`}</h6>
                  <Button href={`/?j=${joke.id}`} variant="secondary" className="min-w-[180px] lg:min-w-[200px]">
                    <FiPlay />
                    <p>Show on Screen</p>
                  </Button>
                </div>
                {jokeIndex !== jokes.length ? <hr className="my-3 sm:my-4 lg:my-5" /> : ''}
                {jokeIndex === jokes.length ? (data.next_page !== page ? (
                  <>
                    <hr className="my-3 sm:my-4 lg:my-5" />
                    <Button variant="primary" className="mx-auto" onClick={() => setpage(data.next_page)}>
                      <FiPlayCircle />
                      <p>Load more</p>
                    </Button>
                  </>
                ) : '') : ''}
              </div>
            )
          }) : null}
        </div>
      </div>
    </>
  )
}

export default Search