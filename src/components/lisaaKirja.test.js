import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LisaaKirja from './lisaaKirja'

test('A book is added properly with input data', async () => {
    const user = userEvent.setup()
    const lisaaKirja = jest.fn()
  
    const { container } = render(<LisaaKirja createKirja={lisaaKirja} />)  
  
    const keyInput = container.querySelector('#key-input')
    const authorInput = container.querySelector('#author')
    const titleInput = container.querySelector('#title')
    const publisherInput = container.querySelector('#publisher')
    const yearInput = container.querySelector('#year')
    const addButton = container.querySelector('#lisaa-button')
  
    // Täytetään lomake
    await user.type(keyInput, 'testkey')
    await user.type(authorInput, 'test author1')
    await user.type(titleInput, 'test title')
    await user.type(publisherInput, 'test publisher')
    await user.type(yearInput, '2023')
    await user.click(addButton)
  
    //testataan, että lisaaArtikkeli kutsutaan lomakkeen hyväksymisen jälkeen
    expect(lisaaKirja).toHaveBeenCalledTimes(1)
    //testataan, että lisaaArtikkeli kutsutaan oikealla parametrilla
    expect(lisaaKirja).toHaveBeenCalledWith({
      articleKey: 'testkey',
      author: [{firstName: "test",
                lastName: "author1"
               }],
      title: 'test title',
      publisher: 'test publisher',
      year: '2023',
    })
})

test('LisaaKirja displays an alert when all fields aren\'t filled', async () => {
    const lisaaKirja = jest.fn()
  
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
  
    render(<LisaaKirja createKirja={lisaaKirja} />)
  
    const sendButton = screen.getByText('lisää')
  
    await userEvent.click(sendButton)
  
    //tarkistaa, ettei lisää artikkelia kutsuta jos kaikki kentät ei ole täytetty
    expect(lisaaKirja).toHaveBeenCalledTimes(0)
  
    // Tarkista, että `window.alert`-funktiota kutsutaan halutulla viestillä
    expect(alertSpy).toHaveBeenCalledWith('Kaikkien kenttien täyttäminen on pakollista')
  
    alertSpy.mockRestore()
})