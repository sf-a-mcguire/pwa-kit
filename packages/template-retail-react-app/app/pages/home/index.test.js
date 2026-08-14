/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {renderWithProviders} from '@salesforce/retail-react-app/app/utils/test-utils'
import HomePage from '@salesforce/retail-react-app/app/pages/home'
import {usePage} from '@salesforce/commerce-sdk-react'

jest.mock('@salesforce/commerce-sdk-react', () => {
    const originalModule = jest.requireActual('@salesforce/commerce-sdk-react')
    return {
        ...originalModule,
        usePage: jest.fn()
    }
})

jest.mock('@salesforce/commerce-sdk-react/page-designer', () => ({
    ...jest.requireActual('@salesforce/commerce-sdk-react/page-designer'),
    // Render a marker so we can assert the pipeline was reached without pulling in
    // the full runtime design machinery.
    Page: ({page}) => <div data-testid="pd-page">{page?.id}</div>
}))

jest.mock('@salesforce/retail-react-app/app/components/image/utils', () => ({
    ...jest.requireActual('@salesforce/retail-react-app/app/components/image/utils'),
    isServer: jest.fn().mockReturnValue(true)
}))

afterEach(() => {
    jest.clearAllMocks()
})

test('Home Page renders without errors', () => {
    usePage.mockReturnValue({data: undefined, isLoading: false, error: null})

    const {getByTestId} = renderWithProviders(<HomePage />)

    expect(getByTestId('home-page')).toBeInTheDocument()
    expect(typeof HomePage.getTemplateName()).toBe('string')
})

test('renders the page content through <Page> when data is available', () => {
    usePage.mockReturnValue({data: {id: 'homepage'}, isLoading: false, error: null})

    const {getByTestId} = renderWithProviders(<HomePage />)

    expect(getByTestId('pd-page')).toHaveTextContent('homepage')
})

test('renders an error notice when the page fails to load', () => {
    usePage.mockReturnValue({data: undefined, isLoading: false, error: {message: 'boom'}})

    const {getByText} = renderWithProviders(<HomePage />)

    expect(
        getByText(
            'Error loading page content. Please check that the homepage is configured in Business Manager Page Designer.'
        )
    ).toBeInTheDocument()
})
