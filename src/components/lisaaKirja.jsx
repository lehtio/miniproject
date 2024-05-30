import { useState } from 'react'

const LisaaKirja = ({ createKirja }) => {
    const [newKirja, setNewKirja] = useState('')
    const [newKey, setNewKey] = useState('')
    const [newAuthors, setNewAuthors] = useState('')
    const [authors, setAuthors] = useState([])
    const [newTitle, setNewTitle] = useState('')
    const [newYear, setNewYear] = useState('')
    const [newPublisher, setNewPublisher] = useState('')

    const validateYear = (year) => {
        const currentYear = new Date().getFullYear()
        return /^\d{4}$/.test(year) && parseInt(year) < currentYear+1
    }

    const addKirja = (event) => {
        event.preventDefault()

        if (!newKey || !newAuthors || !newTitle || !newYear || !newPublisher) {
            alert('Kaikkien kenttien täyttäminen on pakollista')
            return
        }

        if (newKey.includes(',') || newKey.includes(' ')) {
            alert('Article key ei saa sisältää välilyöntejä tai pilkkuja')
            return
        }

        if (!validateYear(newYear)) {
            alert('Vuosiluvun tulee olla nelinumeroinen ja maksimissaan tämämän hetkinen vuosiluku.')
            return;
        }

        const newKirja = {
            articleKey: newKey,
            author: authors,
            title: newTitle,
            year: newYear,
            publisher: newPublisher
        }

        setNewKirja(newKirja)

        createKirja(newKirja)

        setNewKirja('')
        setNewKey('')
        setNewAuthors('')
        setNewTitle('')
        setNewYear('')
        setNewPublisher('')
    }

    const handleKeyChange = (event) => {
        setNewKey(event.target.value)
    }
    
    const handleAuthorChange = (event) => {
        setNewAuthors(event.target.value)
        const authors = event.target.value
        // authorit on eroteltu 'and'
        const names = authors.split(' and ')
        const authorsArray = []
    
        for (let i = 0; i < names.length; i++) {
            const name = names[i].trim()
    
            if (name.includes(',')) {
            // Muoto: Sukunimi, Etunimi
            const [lastName, firstName] = name.split(',').map(item => item.trim())
            authorsArray.push({ firstName, lastName })
            } else {
            // Muoto: Etunimi Sukunimi
            const [firstName, lastName] = name.split(' ')
            authorsArray.push({ firstName, lastName })
            }
        }
        setAuthors(authorsArray)
    }

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }

    const handleYearChange = (event) => {
        setNewYear(event.target.value)
    }

    const handlePublisherChange= (event) => {
        setNewPublisher(event.target.value)
    }

    return(
        <form onSubmit={addKirja}>
        <h2>Lisää kirja</h2>
            <div>
                key: <input value ={newKey} onChange={handleKeyChange} id='key-input'/>
            </div>
            <div>
                author: <input value={newAuthors} onChange={handleAuthorChange} id='author'/>
            </div>
            <div>
                title: <input value={newTitle} onChange={handleTitleChange} id='title'/>
            </div>
            <div>
                year: <input value={newYear} onChange={handleYearChange} id='year'/>
            </div>
            <div>
                publisher: <input value={newPublisher} onChange={handlePublisherChange} id='publisher'/>
            </div>
            <div>
                <button type="submit" id='lisaa-button'>lisää</button>
            </div>
        </form>
    )
}

export default LisaaKirja