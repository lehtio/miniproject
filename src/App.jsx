import { useState, useEffect } from 'react'
import axios from 'axios'
import Lisaa from './components/lisaa'
import LisaaYhdArtikkeli from './components/lisaaYhdArtikkeli'
import LisaaKirja from './components/lisaaKirja'
import { saveAs } from 'file-saver'
import './App.css'
import DOI from './components/doi'

function App() {
  const [artikkelit, setArtikkelit] = useState([])
  const [message, setMessage] = useState('');
  const [artikkeliAuki, setArtikkeliAuki] = useState(false);
  const [yhdistelmaArtikkeliAuki, setYhdistelmaArtikkeliAuki] = useState(false);
  const [kirjaAuki, setKirjaAuki] = useState(false);
  const [doiAuki, setDOIAuki] = useState(false)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/artikkelit')
      .then(response => {
        console.log('promise fulfilled')
        setArtikkelit(response.data)
      })
  }, [])
  console.log('render', artikkelit.length, 'artikkelit')

  // tarkistetaan onko key jo olemassa, jos on niin antaa alertin 
  //(artikkeli, yhdistelmäartikkeli ja kirja ok )
  const isKeyDuplicate = (key) => {
    return artikkelit.some(artikkeli => artikkeli.articleKey === key);
  }
  
  const lisaaArtikkeli = (artikkeliObject) => {
    if (isKeyDuplicate(artikkeliObject.articleKey)) {
      alert('The article key already exists. Please use a unique key.');
      return;
    }
    axios
      .post('http://localhost:3001/artikkelit', artikkeliObject)
      .then(response => {
        setArtikkelit(artikkelit.concat(artikkeliObject))
    })
  }

  const lisaaYhdArtikkeli = (artikkeliObject) => {
    if (isKeyDuplicate(artikkeliObject.articleKey)) {
      alert('The article key already exists. Please use a unique key.');
      return;
    }
    axios
      .post('http://localhost:3001/artikkelit', artikkeliObject)
      .then(response => {
        setArtikkelit(artikkelit.concat(artikkeliObject))
      })
  }

  const lisaaKirja = (artikkeliObject) => {
    if (isKeyDuplicate(artikkeliObject.articleKey)) {
      alert('The article key already exists. Please use a unique key.');
      return;
    }
    axios
      .post('http://localhost:3001/artikkelit', artikkeliObject)
      .then(response => {
        setArtikkelit(artikkelit.concat(artikkeliObject))
      })
  }

  const lisaaDOI = (reference) => {
    if (isKeyDuplicate(reference.articleKey)) {
      alert('The article key already exists. Please use a unique key.')
      return
    }
    axios
      .post('http://localhost:3001/artikkelit', reference)
      .then(response => {
        setArtikkelit(artikkelit.concat(reference))
    })
  }


  // artikkelien järjestys kirjoittajan sukunimen perusteella
  const jarjastaArtikkelit = () => {
    const sortedArticles = [...artikkelit].sort((a, b) => {
      if (a.author[0].lastName === b.author[0].lastName) {
        const firstNameA = a.author[0].firstName.toLowerCase()
        const firstNameB = b.author[0].firstName.toLowerCase()
        return firstNameA.localeCompare(firstNameB)
      } 
      const lastNameA = a.author[0].lastName.toLowerCase()
      const lastNameB = b.author[0].lastName.toLowerCase()
      return lastNameA.localeCompare(lastNameB)
    })
    setArtikkelit(sortedArticles)
  }

    // Funktio BibTeX-muotoisen merkkijonon rakentamiseksi
    const generateBibTeX = (artikkeli) => {
      const authors = artikkeli.author.map(author => `${author.lastName}, ${author.firstName}`).join(' and ')
      const doi = artikkeli.DOI ? `doi = {${artikkeli.DOI}}` : ''
      console.log('DOI:', doi)
      let ret = ""

      if (artikkeli.booktitle) {
        ret = `@inproceedings{${artikkeli.articleKey},
               author = {${authors}},
               title = {${artikkeli.title}},
               booktitle = {${artikkeli.booktitle}},
               year = {${artikkeli.year}}`
      }
        
      else if (artikkeli.publisher) {
        ret = `@book{${artikkeli.articleKey},
               author = {${authors}},
               title = {${artikkeli.title}},
               publisher = {${artikkeli.publisher}},
               year = {${artikkeli.year}}`               
      }

      else {
        ret = `@article{${artikkeli.articleKey},
               author = {${authors}},
               title = {${artikkeli.title}},
               journal = {${artikkeli.journal}},
               volume = {${artikkeli.volume}},
               pages = {${artikkeli.pages}},
               year = {${artikkeli.year}}`
      }

      if (doi) {
        ret += `,
               ${doi}`
      }
      
      return ret + "\n}"
    }

  //Luodaan sisältö valmiiksi tallennettavaa bibtex-tiedostoa varten
  let bibtexContent = ''
  artikkelit.forEach(artikkeli => {
    bibtexContent += generateBibTeX(artikkeli) + ('\n\n')
  })

  //Tallennetaan lähteet tiedostona koneelle
  function downloadBibTeXFile() {
    const blob = new Blob([bibtexContent], { type: 'text/plain;charset=utf-8' });
    const fileName = 'bibText.bib'
    saveAs(blob, fileName);
  }
  
  //Tarvittaessa tietokannan tyhennystä varten 
  const clearDatabase = async () => {
    try {
      const response = await axios.get('http://localhost:3001/artikkelit');
      const articles = response.data;
      // Käydään läpi jokainen id ja lähetetään DELETE-pyyntö
      for (const article of articles) {
        await axios.delete(`http://localhost:3001/artikkelit/${article.id}`);
        console.log(`Artikkeli ID: ${article.id} poistettu`);
      }
      // Päivitä näkymä
      window.location.reload();
    } catch (error) {
      console.error('Virhe:', error);
    }
  };

  const toggleArtikkeli = () => {
    setArtikkeliAuki(!artikkeliAuki);
    if(yhdistelmaArtikkeliAuki)
      setYhdistelmaArtikkeliAuki(false)
    console.log(yhdistelmaArtikkeliAuki)
    if(kirjaAuki)
      setKirjaAuki(false)
    if(doiAuki)
      setDOIAuki(false)
  };

  const toggleYhdistelmaArtikkeli = () => {
    setYhdistelmaArtikkeliAuki(!yhdistelmaArtikkeliAuki);
    console.log(yhdistelmaArtikkeliAuki)
    if(artikkeliAuki)
      setArtikkeliAuki(false)
    if(kirjaAuki)
      setKirjaAuki(false)
    if(doiAuki)
      setDOIAuki(false)
  };

  const toggleKirja = () => {
    setKirjaAuki(!kirjaAuki);
    console.log(kirjaAuki)
    if(artikkeliAuki)
      setArtikkeliAuki(false)
    if(yhdistelmaArtikkeliAuki)
      setYhdistelmaArtikkeliAuki(false)
    if(doiAuki)
      setDOIAuki(false)
  };

  const toggleDOI = () => {
    setDOIAuki(!doiAuki)
    if(artikkeliAuki)
      setArtikkeliAuki(false)
    if(yhdistelmaArtikkeliAuki)
      setYhdistelmaArtikkeliAuki(false)
    console.log(yhdistelmaArtikkeliAuki)
    if(kirjaAuki)
      setKirjaAuki(false)
  }
  return (
    <>
        <h1>Lisää lähteitä</h1>
        <button id='artikkeli-button' onClick={toggleArtikkeli}> Lisää artikkeli </button>
        <button id='yhdistelma-button' onClick={toggleYhdistelmaArtikkeli}> Lisää yhdistelmäartikkeli </button>
        <button id='kirja-button'onClick={toggleKirja}> Lisää kirja </button>
        <button id='doi-button'onClick={toggleDOI}> Lisää DOI-tunnisteella </button>
        {artikkeliAuki && <Lisaa createArtikkeli={lisaaArtikkeli} />}
        {yhdistelmaArtikkeliAuki && <LisaaYhdArtikkeli createYhdArtikkeli={lisaaYhdArtikkeli} />}
        {kirjaAuki && <LisaaKirja createKirja={lisaaKirja} />}
        {doiAuki && <DOI createByDOI={lisaaDOI} />}
        <h2>Lähteet</h2>
        {/* tietokannan tyhennys */}
        <button onClick={clearDatabase}>Tyhjennä tietokanta</button>
        <button id="jarjesta-button" onClick={jarjastaArtikkelit}>Järjestä Artikkelit</button>
        <p>{message}</p>
        {artikkelit.map((artikkeli, indeksi) => (
        <div key={indeksi} className="artikkelituloste">
          <p>[{indeksi + 1}]</p>
          <p>{artikkeli.author.map((author, index) => {
            console.log(artikkeli)
            // Tulostuksissa näytettävän nimen muotoilu
            let fullname = `${author.firstName} ${author.lastName}`
            // Nimi tulostukseen
            if (index === 0) {
              return fullname               // Ensimmäinen authori ilman merkkejä
            } else if (index === artikkeli.author.length-1) {
              return ` and ${fullname}`;    // and ennen vikaa authoria
            }
            else {
              return `, ${fullname}`;       // pilkut muiden authorien väliin
            }
          })}.</p>
          <p className="artikkelititle">{artikkeli.title}.</p>
          { artikkeli.journal &&
            <>
              <p className="artikkelijournal">{artikkeli.journal},</p> 
              <p>{`${artikkeli.volume}:${artikkeli.pages},`}</p> 
            </>
          }
          {
            artikkeli.booktitle &&
            <>
              <p>{artikkeli.booktitle},</p>
            </>
          }
          {
            artikkeli.publisher &&
            <>
              <p>{artikkeli.publisher},</p>
            </>
          }
          <p>{artikkeli.year}.</p>
        </div>
))}
      <button onClick={downloadBibTeXFile}>Lataa BibTeX-tiedosto</button>
      <h2>Lähteet BibTeX-muodossa</h2>
      {artikkelit.map((artikkeli, indeksi) => (
        <div key={indeksi} className="artikkelituloste">
          <p><pre>{generateBibTeX(artikkeli)}</pre></p>
        </div>
      ))}

    </>
  )
}


export default App