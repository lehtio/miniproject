import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import DOI from './doi'


jest.mock('axios')

// Mockataan data hakemisen sijalle
const mockData = {
    message: {
        type: "journal-article",
        author: [
            { given: "J.", family: "Leppäluoto" },
            { given: "T.", family: "Pääkkönen" },
            { given: "I.", family: "Korhonen" },
            { given: "J.", family: "Hassi" }
        ],
        title: ['Pituitary and autonomic responses to cold exposures in man'],
        'container-title': 'Acta Physiologica Scandinavica',
        created: { 'date-parts': [[2005]] },
        volume: '184',
        page: '255-264',
        DOI: '10.1111/j.1365-201x.2005.01464.x'
    }
}

axios.get.mockResolvedValue({ data: mockData })

//DOI-tunnisteella lisäämisen testaus
test('Article is added using a working DOI', async () => {
    const user = userEvent.setup()
    const lisaaDOI = jest.fn()
    window.alert = jest.fn()

    const { container } = render(<DOI createByDOI={lisaaDOI} />)

    const keyInput = container.querySelector("#key-input")
    const doiInput = container.querySelector("#doi-input")
    const haeButton = container.querySelector("#hae-button")

    await user.type(keyInput, 'testkey')
    await user.type(doiInput, '10.1111/j.1365-201x.2005.01464.x')
    await user.click(haeButton)

    await waitFor(() => {
        expect(lisaaDOI).toHaveBeenCalledTimes(1)
    })

    //Tarkastetaan onko käytetty haettua dataa
    await waitFor(() => {
        expect(lisaaDOI).toHaveBeenCalledWith({
            articleKey: 'testkey',
            author: [
                {
                    firstName: 'J.',
                    lastName: 'Leppäluoto'
                },
                {
                    firstName: 'T.',
                    lastName: 'Pääkkönen'
                },
                {
                    firstName: 'I.',
                    lastName: 'Korhonen'
                },
                {
                    firstName: 'J.',
                    lastName: 'Hassi'
                }],
            title: ["Pituitary and autonomic responses to cold exposures in man"],
            journal: "Acta Physiologica Scandinavica",
            year: 2005,
            volume: "184",
            pages: "255-264",
            DOI: '10.1111/j.1365-201x.2005.01464.x'
        })
    })
    
    //Tarkastetaan onko datan hakemiseen käytetty syötettyä DOI:ta
    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('https://api.crossref.org/works/10.1111/j.1365-201x.2005.01464.x')
    })
})

test('Article is not added when article key isn\'t entered', async () => {
    const user = userEvent.setup()
    const lisaaDOI = jest.fn()
    window.alert = jest.fn()

    const { container } = render(<DOI createByDOI={lisaaDOI} />)

    const doiInput = container.querySelector("#doi-input")
    const haeButton = container.querySelector("#hae-button")

    await user.type(doiInput, '10.1111/j.1365-201x.2005.01464.x')
    await user.click(haeButton)

    await waitFor(() => {
        expect(lisaaDOI).toHaveBeenCalledTimes(0)
    })
})

// testataan ettei lisää jos key on tupla
test('Article is not added when article key is duplicate', async () => {
    const user = userEvent.setup()
    const lisaaDOI = jest.fn()
    window.alert = jest.fn()

    // Mock axios jotta palautetaan oikea data
    axios.get.mockResolvedValueOnce({ data: mockData })

    
    const existingKeys = ['existingKey']
    const { container } = render(<DOI createByDOI={(ref) => {
        if (existingKeys.includes(ref.articleKey)) {
            window.alert('The article key already exists. Please use a unique key.')
            return
        }
        lisaaDOI(ref)
    }} />)

    const keyInput = container.querySelector("#key-input")
    const doiInput = container.querySelector("#doi-input")
    const haeButton = container.querySelector("#hae-button")

        // testataan tuplakeylla
    await user.type(keyInput, 'existingKey')
    await user.type(doiInput, '10.1111/j.1365-201x.2005.01464.x')
    await user.click(haeButton)

    await waitFor(() => {
        expect(lisaaDOI).toHaveBeenCalledTimes(0)
        expect(window.alert).toHaveBeenCalledWith('The article key already exists. Please use a unique key.')
    })
})