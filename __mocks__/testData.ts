export const apiKeys = {
    'WEBSITE_API_NAMESPACE_ID': "3af64f2d-9d79-4e52-b0b5-130c4719bb35",
    'WEBSITE_API_PUBLIC': "deb38418-ae89-4569-b53f-86ab086aee1e",
    'WEBSITE_API_SECRET': "bd72c07e-53f8-4631-b16b-10159e7ebe6a",
    'NEXT_PUBLIC_WEBSITE_DOMAIN': "https://demo-ring.com",
    'NEXT_PUBLIC_WEBSITE_API_VARIANT': "ALL_FEATURES_BACKUP",
}

export const MockNextServer = {
    getRequestHandler: jest.fn(),
    getUpgradeHandler: jest.fn(),
    setAssetPrefix: jest.fn(),
    render: jest.fn(),
    renderToHTML: jest.fn(),
    renderError: jest.fn(),
    renderErrorToHTML: jest.fn(),
    render404: jest.fn(),
    serveStatic: jest.fn(),
    prepare: jest.fn(() => {
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }),
    close: jest.fn()
}

export const contentQueryMock = `
data {
    node {
        id
    }
    content {
        __typename
        ...on Story {
            id,
            title
        }
        ...on SiteNode {
            id,
            slug,
            category {
              id
            }
        }
        ...on Topic {
            id,
            name
        }
        ...on Source{
            id,
            name
        }
        ...on Author{
            id,
            name
        }
        ...on CustomAction{
            id,
            action
        }
    }
}`;
