import { useState } from 'react'

const LisaaYhdArtikkeli = ({ createYhdArtikkeli }) => {
  const [newYhdArtikkeli, setNewYhdArtikkeli] = useState('')
  const [newKey, setNewKey] = useState('')
  const [newAuthors, setNewAuthors] = useState('')
  const [authors, setAuthors] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newYear, setNewYear] = useState('')
  const [newBookTitle, setNewBookTitle] = useState('')

  const validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    return /^\d{4}$/.test(year) && parseInt(year) < currentYear+1;
  }

  const addYhdArtikkeli = (event) => {
    event.preventDefault()

    if (!newKey || !newAuthors || !newTitle || !newYear || !newBookTitle) {
      alert('Kaikkien kenttien täyttäminen on pakollista')
      return
    }

    //Tarkastetaan, että articlekey ei sisällä pilkkuja tai välilyöntejä.
    if (newKey.includes(',') || newKey.includes(' ')) {
      alert('Article key ei saa sisältää välilyöntejä tai pilkkuja')
      return
    }

    if (!validateYear(newYear)) {
      alert('Vuosiluvun tulee olla nelinumeroinen ja maksimissaan tämämän hetkinen vuosiluku.')
      return;
    }
    
    const newYhdArtikkeli = {
      articleKey: newKey,
      author: authors,
      title: newTitle,
      year: newYear,
      booktitle: newBookTitle
    }

    setNewYhdArtikkeli(newYhdArtikkeli)

    createYhdArtikkeli(newYhdArtikkeli)
    
    setNewYhdArtikkeli('')
    setNewKey('')
    setNewAuthors('')
    setNewTitle('')
    setNewYear('')
    setNewBookTitle('')
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

  const handleBookTitleChange= (event) => {
    setNewBookTitle(event.target.value)
  }
           
    return(
    <form onSubmit={addYhdArtikkeli}> 
    <h2>Lisää yhdistelmäartikkeli</h2>
        <div>
          key: <input value={newKey} onChange={handleKeyChange} id='key-input'/>
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
          booktitle: <input value={newBookTitle} onChange={handleBookTitleChange} id='booktitle'/>
        </div>
        <div>
          <button type="submit" id='lisaa-button'>lisää</button>
       </div>
    </form>
        
    )
}



export default LisaaYhdArtikkeli