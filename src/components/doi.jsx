import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DOI = ({createByDOI}) => {
    const [newKey, setNewKey] = useState('')
    const [doi, setDoi] = useState('')
    const [reference, setReference] = useState(null)

    useEffect(() => {
        console.log('effect')
        axios
        .get(`https://api.crossref.org/works/${doi}`)
        .then(response => {
            setReference(response.data)
            console.log(response.data)
        })
    }, [doi])

    const handleKeyChange = (event) => {
        setNewKey(event.target.value)
      }

    const handleInputChange = (event) => {
        setDoi(event.target.value)
      }


    const handleSearch = (event) => {
        event.preventDefault()

        if (!newKey || !doi) {
            alert('Kaikkien kenttien täyttäminen on pakollista')
            return
          }
      
          //Tarkastetaan, että articlekey ei sisällä pilkkuja tai välilyöntejä.
          if (newKey.includes(',') || newKey.includes(' ')) {
            alert('Article key ei saa sisältää välilyöntejä tai pilkkuja')
            return
          }
        
        if (reference.message.type=="journal-article"){
            const newReference = {
                articleKey: newKey,
                author: reference.message.author.map(author => ({
                    firstName: author.given,
                    lastName: author.family})),
                title: reference.message.title,
                journal: reference.message["container-title"],
                year: reference.message.created["date-parts"][0][0],
                volume: reference.message.volume,
                pages: reference.message.page,
                DOI: reference.message.DOI
        } 
        createByDOI(newReference)
        }

        if (reference.message.type=="proceedings-article"){
          const newReference = {
            articleKey: newKey,
            author: reference.message.author.map(author => ({
                firstName: author.given,
                lastName: author.family})),
            title: reference.message.title,
            year: reference.message.created["date-parts"][0][0],
            booktitle: reference.message["container-title"],
            DOI: reference.message.DOI
            } 
            createByDOI(newReference)
        }

        if (reference.message.type=="book"){
            const newReference = {
                articleKey: newKey,
                author: reference.message.author.map(author => ({
                    firstName: author.given,
                    lastName: author.family})),
                title: reference.message.title,
                year: reference.message.created["date-parts"][0][0],
                publisher: reference.message.publisher,
                DOI: reference.message.DOI
             }
            createByDOI(newReference)
        }

        setNewKey('')
        setDoi('')
        
    }

    return (
        <div>
        <div>
          key: <input value={newKey} onChange={handleKeyChange} id='key-input'/>
        </div>
        <input
          type="text"
          value={doi}
          onChange={handleInputChange}
          id='doi-input'
          placeholder="Syötä DOI-tunniste"
        />
        <button onClick={handleSearch} id='hae-button'>Hae</button>
        </div>
    )

}

export default DOI