export const apiKeys = {
    'WEBSITE_API_NAMESPACE_ID': "11478ab5-dea4-4440-bd19-53804474e2e0",
    'WEBSITE_API_PUBLIC': "5449ba34-5c94-40c1-8365-2d6766582054",
    'WEBSITE_API_SECRET': "94e50121-b681-4c25-b325-270422e91df0",
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
