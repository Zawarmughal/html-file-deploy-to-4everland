import React, { useState } from 'react'
import JSZip from 'jszip'
import axios from 'axios'

const NFTCard = ({ title, owner, links, description }) => {
    return (
        <div
            style={{
                border: '1px solid black',
                width: '400px',
                height: '450px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, lightblue, lightcoral)',
                boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
                padding: '10px',
                margin: 'auto',
                marginTop: '20px',
            }}
        >
            <h1 style={{ textAlign: 'center' }}>{title}</h1>
            <h3>Owner: {owner}</h3>
            <div>
                {links.map((link, index) => (
                    <div key={index}>
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                marginRight:
                                    index < links.length - 1 ? '10px' : '0',
                            }}
                        >
                            {link.text}
                        </a>
                        <br />
                    </div>
                ))}
            </div>
            <h2>Description</h2>
            <p>{description}</p>
        </div>
    )
}

const UploadTo4everland = () => {
    const [nftData, setNftData] = useState({
        title: '',
        owner: '',
        links: [{ href: '', text: '' }],
        description: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNftData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleLinkChange = (index, e) => {
        const { name, value } = e.target
        const updatedLinks = [...nftData.links]
        updatedLinks[index][name] = value
        setNftData((prevData) => ({
            ...prevData,
            links: updatedLinks,
        }))
    }

    const addLink = () => {
        setNftData((prevData) => ({
            ...prevData,
            links: [...prevData.links, { href: '', text: '' }],
        }))
    }

    const generateHTMLFile = async () => {
        const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;">
        <div style="
            border: 1px solid black;
            width: 400px;
            height: 450px;
            border-radius: 15px;
            background: linear-gradient(135deg, lightblue, lightcoral);
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
            padding: 10px;
            margin:'auto';
            margin-top:'20px';">
          <h1 style="text-align: center;">${nftData.title}</h1>
          <h3 style="text-align: center;">Owner: ${nftData.owner}</h3>
          <div style="text-align: center; display: flex; flex-direction:column; justify-content:center;">
            ${nftData.links
                .map(
                    (link) =>
                        `<div>
                        <a
                            href="${link.href}"
                            target="_blank"
                            style="margin-right: 10px;"
                        >
                            ${link.text}
                        </a>
                        <br />
                    </div>`
                )
                .join('')}
          </div>
          <div style="text-align: center;">
            <h2>Description</h2>
            <p>${nftData.description}</p>
          </div>
        </div>
      </body>
    </html>
    `

        // Create a Blob from the HTML string
        const blob = new Blob([htmlContent], { type: 'text/html' })

        const zip = new JSZip()
        zip.file('index.html', blob)

        // Generate the ZIP file and trigger download
        const zipBlob = await zip.generateAsync({ type: 'blob' })

        uploadHTMLFile(zipBlob)
    }

    const uploadHTMLFile = async (file) => {
        // Example using 4EVERLAND for file upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', process.env.REACT_APP_PROJECT_ID)

        try {
            const response = axios.post(
                'https://hosting.api.4everland.org/deploy',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token: process.env.REACT_APP_TOKEN_ID,
                    },
                }
            )
            console.log('Response:', response)
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '50vw' }}>
                <h2>Enter NFT Data</h2>
                <form>
                    <div
                        style={{
                            display: 'flex',
                            marginBottom: 20,
                        }}
                    >
                        <div>
                            <label
                                style={{ fontWeight: 'bold', fontSize: '24px' }}
                            >
                                Title:{' '}
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={nftData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div style={{ marginLeft: 15 }}>
                            <label
                                style={{ fontWeight: 'bold', fontSize: '24px' }}
                            >
                                Owner:{' '}
                            </label>
                            <input
                                type="text"
                                name="owner"
                                value={nftData.owner}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {nftData.links.map((link, index) => (
                        <div
                            key={index}
                            style={{ display: 'flex', marginTop: 10 }}
                        >
                            <label style={{ fontWeight: 'bold' }}>
                                Link {index + 1} Text:{' '}
                            </label>
                            <input
                                type="text"
                                name="text"
                                value={link.text}
                                onChange={(e) => handleLinkChange(index, e)}
                            />
                            <label style={{ fontWeight: 'bold' }}>
                                {' '}
                                Link {index + 1} URL:{' '}
                            </label>
                            <input
                                type="text"
                                name="href"
                                value={link.href}
                                onChange={(e) => handleLinkChange(index, e)}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLink}
                        style={{
                            display: 'flex',
                            marginTop: 15,
                            borderRadius: 5,
                            padding: 4,
                        }}
                    >
                        Add Another Link
                    </button>
                    <div style={{ marginTop: 30, display: 'flex' }}>
                        <label style={{ fontWeight: 'bold' }}>
                            Description:{' '}
                        </label>
                        <textarea
                            name="description"
                            value={nftData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
                <button
                    style={{
                        marginTop: 15,
                        padding: 10,
                        borderRadius: 8,
                        background:
                            'linear-gradient(135deg, lightblue, lightcoral)',
                    }}
                    type="button"
                    onClick={generateHTMLFile}
                >
                    Generate File and Upload to 4everLand
                </button>
            </div>
            <div
                style={{
                    width: '50vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <NFTCard
                    title={nftData.title}
                    owner={nftData.owner}
                    links={nftData.links}
                    description={nftData.description}
                />
            </div>
        </div>
    )
}

export default UploadTo4everland
