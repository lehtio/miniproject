import { useState } from 'react'

const Lisaa = ({ createArtikkeli }) => {

  const [newArtikkeli, setNewArtikkeli] = useState('')
  const [newKey, setNewKey] = useState('')
  const [newAuthors, setNewAuthors] = useState('')
  const [authors, setAuthors] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newJournal, setNewJournal] = useState('')
  const [newYear, setNewYear] = useState('')
  const [newVolume, setNewVolume] = useState('')
  const [newPages, setNewPages] = useState('')

  //tarkistus että vuosinumero on 4 numeroa pitkä
  //ja pienempi kuin tämä vuosi + 1
  const validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    return /^\d{4}$/.test(year) && parseInt(year) < currentYear+1;
  }

  const validatePages = (pages) => {
    return parseInt(pages) > 0
  }

  const addArtikkeli = (event) => {
    event.preventDefault()

    if (!newKey || !newAuthors || !newTitle || !newJournal || !newYear || !newVolume || !newPages) {
      alert('Kaikkien kenttien täyttäminen on pakollista')
      return
    }

    //Tarkastetaan, että articlekey ei sisällä pilkkuja tai välilyöntejä.
    if (newKey.includes(',') || newKey.includes(' ')) {
      alert('Article key ei saa sisältää välilyöntejä tai pilkkuja')
      return
    }

    if (!validatePages(newPages)) {
      alert('Anna kelvollinen luku sivuille!')
      return;
    }

    if (!validateYear(newYear)) {
      alert('Vuosiluvun tulee olla nelinumeroinen ja maksimissaan tämämän hetkinen vuosiluku.')
      return;
    }

    //TODO: authorin etunimen ja sukunimen syöttämisen tarkastus
    
    const newArtikkeli = {
      articleKey: newKey,
      author: authors,
      title: newTitle,
      journal: newJournal,
      year: newYear,
      volume: newVolume,
      pages: newPages,
    }

    setNewArtikkeli(newArtikkeli)

    createArtikkeli(newArtikkeli)
    
    setNewArtikkeli('')
    setNewKey('')
    setNewAuthors('')
    setNewTitle('')
    setNewJournal('')
    setNewYear('')
    setNewVolume('')
    setNewPages('')
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

  const handleJournalChange = (event) => {
    setNewJournal(event.target.value)
  }

  const handleYearChange = (event) => {
    setNewYear(event.target.value)
  }

  const handleVolumeChange = (event) => {
    setNewVolume(event.target.value)
  }

  const handlePagesChange = (event) => {
    setNewPages(event.target.value)
  }
           
    return(
    <form onSubmit={addArtikkeli}> 
    <h2>Lisää artikkeli</h2>
        <div>
          key: <input value={newKey} onChange={handleKeyChange} id='key-input'/>
        </div>
        <div>
          author: <input value={newAuthors} onChange={handleAuthorChange} id='author'/>
        </div>
        <div>
          title: <input value={newTitle} onChange={handleTitleChange} id='title'/>
        </div>
          journal: <input value={newJournal} onChange={handleJournalChange} id='journal'/>
        <div>
          year: <input value={newYear} onChange={handleYearChange} id='year'/>
        </div>
        <div>
          volume: <input value={newVolume} onChange={handleVolumeChange} id='volume'/>
        </div>
        <div>
          pages: <input value={newPages} onChange={handlePagesChange} id='pages'/>
        </div>
        <div>
          <button type="submit" id='lisaa-button'>lisää</button>
       </div>
    </form>
        
    )
}




export default Lisaa