import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateCareerAdvice } from './geminiService';

describe('generateCareerAdvice', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return career advice on successful API call', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        message: { content: '  Your career advice is to learn Vitest!  ' }
      }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const advice = await generateCareerAdvice('test prompt', 'general', 'en');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"prompt":"test prompt"'),
      })
    );
    expect(advice).toBe('Your career advice is to learn Vitest!');
  });

  it('should return an error message when API returns an error', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: { message: 'Internal server error' } }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const advice = await generateCareerAdvice('test prompt', 'general', 'en');

    expect(advice).toBe('Error generating content. Check your configured model.');
  });

  it('should return a connection error message when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const advice = await generateCareerAdvice('test prompt', 'general', 'en');

    expect(advice).toBe('AI Connection error. Check if Ollama is running and the configured model is correct.');
  });

  it('should handle rate limiting error message in portuguese', async () => {
    const mockResponse = {
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      json: () => Promise.resolve({ error: { message: 'Rate limit exceeded' } }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const advice = await generateCareerAdvice('test prompt', 'general', 'pt');
    expect(advice).toBe('⚠️ Limite diário atingido. Tente novamente amanhã.');
  });
});
