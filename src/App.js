
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import FavouriteGenre from './components/FavouriteGenre'
import { useQuery, useApolloClient, useLazyQuery, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from './queries'

const Notify = ({ errorMessage }) => {
    if (!errorMessage) {
        return null
    }

    return (
        <div style={{ color: 'red' }}>
            {errorMessage}
        </div>
    )
}

const App = () => {
    const [page, setPage] = useState('authors')
    const [errorMessage, setErrorMessage] = useState(null)
    const [token, setToken] = useState(null)
    const [userDetails, setDetails] = useState(null)
    const authorResult = useQuery(ALL_AUTHORS)
    const bookResult = useQuery(ALL_BOOKS)
    const client = useApolloClient()

    const [getUser, userResult] = useLazyQuery(ME, {
        fetchPolicy: 'network-only'
    })

    const getUserDetails = () => getUser()

    useEffect(() => {
        const token = localStorage.getItem('phonenumbers-user-token')
        if (token) {
            setToken(token)
        }
        if (!userDetails) getUserDetails()
        if (userResult.data) {
            setDetails(userResult.data)
        }

    }, [userResult.data])

    const updateCacheWith = (addedBook) => {
        const includedIn = (set, object) => {
            const modified = set.map(b => b.id)
            return modified.includes(object.id)
        }

        const dataInStore = client.readQuery({ query: ALL_BOOKS })
        if (!includedIn(dataInStore.allBooks, addedBook)) {
            client.writeQuery({
                query: ALL_BOOKS,
                data: { allBooks: dataInStore.allBooks.concat(addedBook) }
            })
        }
    }

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            const addedBook = subscriptionData.data.bookAdded
            notify(`${addedBook.title} added`)
            updateCacheWith(addedBook)
        }
    })

    if (authorResult.loading || bookResult.loading) {
        return <div>loading...</div>
    }

    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
        setDetails(null)

        if (page === 'favourite') setPage('books')
    }

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {token ? <button onClick={() => setPage('favourite')}>favourite genre</button> : null}
                {token ? <button onClick={() => setPage('add')}>add book</button>
                    : null
                }
                {token ? <button onClick={logout} >logout</button> :
                    <button onClick={() => setPage('login')} >login</button>
                }
            </div>
            <Notify errorMessage={errorMessage} />
            <LoginForm
                token={token}
                show={page === 'login'}
                setToken={setToken}
                setError={setErrorMessage}
                setPage={setPage}
                getUserDetails={getUserDetails}
            />
            <Authors
                token={token}
                show={page === 'authors'}
                setError={notify}
                authors={authorResult.data.allAuthors}
            />
            <Books
                show={page === 'books'}
                books={bookResult.data.allBooks}
            />
            <NewBook
                token={token}
                show={page === 'add'}
                setError={notify}
                setPage={setPage}
                updateCacheWith={updateCacheWith}
            />

            <FavouriteGenre
                show={page === 'favourite'}
                books={bookResult.data.allBooks}
                userDetails={userDetails}
            />
        </div>
    )
}

export default App