/**
 * Unit Tests for Data Service Module
 * Tests API fetching with mocked fetch
 */

const {
    fetchData,
    getProjects,
    getBlogPosts,
    submitContactForm,
    ApiError,
    API_CONFIG
} = require('../../src/api/dataService');

// Mock fetch globally
global.fetch = jest.fn();

describe('DataService', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('fetchData', () => {
        test('should fetch data successfully (Happy Path)', async () => {
            const mockData = { id: 1, name: 'Test Project' };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockData)
            });

            const result = await fetchData('/test');

            expect(fetch).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockData);
        });

        test('should handle 404 errors', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            });

            await expect(fetchData('/nonexistent'))
                .rejects
                .toThrow(ApiError);
        }, 15000);

        test('should handle 500 server errors', async () => {
            // Mock multiple responses for retry attempts
            fetch.mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            });

            await expect(fetchData('/error'))
                .rejects
                .toThrow('HTTP 500');
        }, 30000);

        test('should handle network errors with retry', async () => {
            fetch
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
                });

            const result = await fetchData('/retry-test');
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(result).toEqual({ success: true });
        }, 15000);

        test('should throw after max retries', async () => {
            fetch.mockRejectedValue(new Error('Persistent error'));

            await expect(fetchData('/persistent-error')).rejects.toThrow('Persistent error');
        }, 30000);

        test('should include correct headers', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            await fetchData('/headers-test');

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    })
                })
            );
        });

        test('should handle POST requests with body', async () => {
            const mockBody = { name: 'Test' };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ id: 1 })
            });

            await fetchData('/post-test', {
                method: 'POST',
                body: mockBody
            });

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(mockBody)
                })
            );
        });
    });

    describe('getProjects', () => {
        test('should fetch projects successfully', async () => {
            const mockProjects = [
                { id: 1, name: 'Project A' },
                { id: 2, name: 'Project B' }
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockProjects)
            });

            const result = await getProjects();

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/projects'),
                expect.any(Object)
            );
            expect(result).toEqual(mockProjects);
        });
    });

    describe('getBlogPosts', () => {
        test('should fetch blog posts with default params', async () => {
            const mockPosts = { posts: [], total: 0 };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockPosts)
            });

            await getBlogPosts();

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('limit=10'),
                expect.any(Object)
            );
        });

        test('should apply custom parameters', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ posts: [] })
            });

            await getBlogPosts({ limit: 5, category: 'ABAP' });

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('limit=5'),
                expect.any(Object)
            );
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('category=ABAP'),
                expect.any(Object)
            );
        });
    });

    describe('submitContactForm', () => {
        test('should submit form data successfully', async () => {
            const formData = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Hello'
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const result = await submitContactForm(formData);

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/contact'),
                expect.objectContaining({
                    method: 'POST'
                })
            );
            expect(result).toEqual({ success: true });
        });

        test('should escape HTML in form data to prevent XSS', async () => {
            const maliciousData = {
                name: '<script>alert("XSS")</script>',
                email: 'test@test.com',
                message: '<img onerror="alert(1)">'
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await submitContactForm(maliciousData);

            const callBody = JSON.parse(fetch.mock.calls[0][1].body);
            expect(callBody.name).not.toContain('<script>');
            expect(callBody.message).not.toContain('<img');
        });
    });

    describe('ApiError', () => {
        test('should create error with correct properties', () => {
            const error = new ApiError('Test error', 500, '/test');

            expect(error.name).toBe('ApiError');
            expect(error.message).toBe('Test error');
            expect(error.statusCode).toBe(500);
            expect(error.endpoint).toBe('/test');
            expect(error.timestamp).toBeDefined();
        });
    });
});
