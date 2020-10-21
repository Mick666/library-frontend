import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../queries'

const Authors = ({ authors, setError }) => {
    const [name, setName] = useState('Martin Fowler')
    const [setBornTo, setYear] = useState('')

    const [ changeBirthYear, result ] = useMutation(EDIT_AUTHOR)

    useEffect(() => {
        console.log(result)
        if (result.data && !result.data.editAuthor) {
            setError('Name not found')
        }
    }, [result.data])

    const submit = async (event) => {
        event.preventDefault()

        console.log(typeof name, typeof setBornTo)

        changeBirthYear({ variables: { name, setBornTo } })
    }

    return (
        <div>
            <h2>Authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            Born
                        </th>
                        <th>
                            Books
                        </th>
                    </tr>
                    {authors.map(a =>
                        <tr key={a.id}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div>
                <h2>Set author birthyear</h2>
                <form onSubmit={submit}>
                    <div>
                        Name
                        <input
                            value={name}
                            onChange={({ target }) => setName(target.value)}
                        />
                    </div>
                    <div>
                        Born
                        <input
                            type='number'
                            value={setBornTo}
                            onChange={({ target }) => Number(setYear(target.value))}
                        />
                    </div>
                    <button type='submit'>Update author</button>
                </form>
            </div>
        </div>
    )
}

export default Authors
