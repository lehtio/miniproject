import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import { saveAs } from 'file-saver'
import userEvent from '@testing-library/user-event'

//Mock saveAs
jest.mock('file-saver', () => ({
    saveAs: jest.fn(),
}))

//Testataan, että bibtex-tiedosto latautuu
test('Downloads BibTeX file with no data', async () => {
    const { getByText } = render(<App />)

    fireEvent.click(getByText('Lataa BibTeX-tiedosto'))

    await waitFor(() => {
        expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'bibText.bib')
    })
})