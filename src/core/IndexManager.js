import debug from 'debug';

const log = debug('mongodb-rag:index');

class IndexManager {
    constructor(collection, options = {}) {
        this.collection = collection;
        this.indexName = options.indexName || 'vector_index';  // <-- Fix: Assign indexName
        this.embeddingFieldPath = options.embeddingFieldPath || 'embedding';  // <-- Fix: Assign embeddingFieldPath
        this.options = {
            dimensions: options.dimensions || 1536,
            similarity: options.similarity || 'cosine',
            ...options
        };
    }
    async ensureIndexes() {
        try {
            log("Checking indexes...");
            await this.createSupportingIndexes(); // Ensure only supporting indexes
            log("All indexes verified");
        } catch (error) {
            throw new Error(`Failed to ensure indexes: ${error.message}`);
        }
    }

    async createSupportingIndexes() {
        try {
            // Index for fast document lookups
            await this.collection.createIndex(
                { documentId: 1 },
                { name: 'document_lookup' }
            );

            // Index for metadata filtering
            await this.collection.createIndex(
                { 'metadata.source': 1, 'metadata.category': 1 },
                { name: 'metadata_filter', sparse: true }
            );

            log('Supporting indexes created successfully');
        } catch (error) {
            throw new Error(`Failed to create supporting indexes: ${error.message}`);
        }
    }

    buildSearchQuery(embedding, filter = {}, options = {}) {
        const vectorSearchQuery = {
            index: this.indexName,
            path: this.embeddingFieldPath,
            queryVector: embedding,
            limit: options.maxResults || 10,
            exact: options.exact || false
        };
    
        if (!vectorSearchQuery.exact) {
            vectorSearchQuery.numCandidates = options.numCandidates || 100;
        }
    
        const pipeline = [
            {
                $vectorSearch: vectorSearchQuery
            },
            {
                $project: {
                    documentId: 1,
                    content: 1,
                    metadata: 1,
                    score: { $meta: "vectorSearchScore" }  // Ensure score is always included
                }
            }
        ];
    
        if (Object.keys(filter).length > 0) {
            pipeline[0].$vectorSearch.filter = filter;
        }
    
        console.log('Generated search query:', JSON.stringify(pipeline, null, 2));
        return pipeline;
    }
    


    async getIndexStats() {
        try {
            const stats = await this.collection.stats();
            const indexes = await this.collection.listIndexes().toArray();

            return {
                documentCount: stats.count,
                indexSize: stats.totalIndexSize,
                indexes: indexes.map(index => ({
                    name: index.name,
                    size: stats.indexSizes[index.name],
                    fields: Object.keys(index.key)
                }))
            };
        } catch (error) {
            throw new Error(`Failed to get index stats: ${error.message}`);
        }
    }
}

export default IndexManager;