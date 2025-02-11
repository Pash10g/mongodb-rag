# MongoDB-RAG

## Overview
MongoDB-RAG (Retrieval Augmented Generation) is an NPM module designed to facilitate seamless vector search using MongoDB Atlas. It provides an efficient way to perform similarity search, caching, batch processing, and indexing to enable fast and accurate retrieval of relevant data from a MongoDB collection.

## Features
- **Vector Search**: Efficiently retrieves similar documents using MongoDB's Atlas Vector Search.
- **Batch Processing**: Handles bulk processing of documents with retry mechanisms.
- **Index Management**: Ensures necessary indexes are available and optimized for vector queries.
- **Caching Mechanism**: Provides in-memory caching for frequently accessed data.
- **Flexible Chunking**: Supports different strategies for chunking long documents into smaller pieces.

## Installation
You can install MongoDB-RAG using npm or yarn:
```sh
# Using npm
npm install mongodb-rag

# Using yarn
yarn add mongodb-rag
```

## Usage

### Importing the Library
```javascript
import { MongoRAG } from 'mongodb-rag';
import dotenv from 'dotenv';
dotenv.config();
```

### Connecting to MongoDB
```javascript
const rag = new MongoRAG({
  mongoUrl: process.env.MONGODB_URI,
  database: "rag_db",
  collection: "documents"
});
await rag.connect();
```

### Inserting Vectors
```javascript
await rag.insertDocument({ documentId: "doc1", embedding: [0.1, 0.2, ...] });
```

### Performing a Vector Search
```javascript
const queryVector = [0.1, 0.2, ...];
const results = await rag.search(queryVector, { limit: 5 });
console.log(results);
```

### Using the Cache Manager
```javascript
import { CacheManager } from 'mongodb-rag';

const cache = new CacheManager({ ttl: 3600, maxSize: 1000 });
await cache.set("query1", results);
const cachedResults = await cache.get("query1");
console.log(cachedResults);
```

### Chunking Large Documents
```javascript
import { Chunker } from 'mongodb-rag';

const chunker = new Chunker({ strategy: "sliding", maxChunkSize: 500, overlap: 50 });
const chunks = chunker.chunkDocument({ id: "doc1", content: "Long document text..." });
console.log(chunks);
```

## Testing
Run the test suite with:
```sh
npm test
```
To run in watch mode:
```sh
npm run test:watch
```
To check test coverage:
```sh
npm run test:coverage
```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.

