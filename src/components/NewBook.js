import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, CREATE_BOOK } from '../queries'

const NewBook = ({ setError, setPage }) => {
    const [title, setTitle] = useState('test')
    const [author, setAuhtor] = useState('test')
    const [published, setPublished] = useState(1000)
    const [genre, setGenre] = useState('test')
    const [genres, setGenres] = useState(['test'])

    const [ createBook ] = useMutation(CREATE_BOOK, {
        refetchQueries: [ { query: ALL_BOOKS } ],
        onError: (error) => {
            console.log(error)
            setError(error.graphQLErrors[0].message)
        }
    })

    const submit = async (event) => {
        event.preventDefault()
        console.log('add book...')
        createBook({
            variables: { title, author, published, genres }
        })

        setTitle('')
        setPublished('')
        setAuhtor('')
        setGenres([])
        setGenre('')
        setPage('books')
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuhtor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type='number'
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">add genre</button>
                </div>
                <div>
                    genres: {genres.join(' ')}
                </div>
                <button type='submit'>create book</button>
            </form>
        </div>
    )
}

export default NewBook