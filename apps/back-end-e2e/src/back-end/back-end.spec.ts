import axios from 'axios';
import type { AxiosError } from 'axios';

describe('@teddy-open-finance/back-end-e2e', () => {
  const testUser = {
    email: `e2e.${Date.now()}@teddy.com`,
    password: '123456',
    name: 'E2E User',
  };
  let accessToken = '';
  let refreshToken = '';
  let createdClientId = '';

  it('runs auth flow and clients CRUD', async () => {
    try {
      const registerResponse = await axios.post('/auth/register', testUser);
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.data).toEqual({ message: 'User registered successfully' });

      const loginResponse = await axios.post('/auth/login', {
        email: testUser.email,
        password: testUser.password,
      });
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.data.user.email).toBe(testUser.email);
      expect(loginResponse.data.user.name).toBe(testUser.name);
      expect(typeof loginResponse.data.accessToken).toBe('string');
      expect(typeof loginResponse.data.refreshToken).toBe('string');

      accessToken = loginResponse.data.accessToken as string;
      refreshToken = loginResponse.data.refreshToken as string;

      const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
      expect(refreshResponse.status).toBe(200);
      expect(typeof refreshResponse.data.accessToken).toBe('string');
      accessToken = refreshResponse.data.accessToken as string;

      const createResponse = await axios.post(
        '/clients',
        {
          name: 'Cliente E2E',
          salary: 12345.67,
          companyValuation: 345678.9,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      expect(createResponse.status).toBe(201);
      expect(createResponse.data.name).toBe('Cliente E2E');
      createdClientId = createResponse.data.id as string;

      const listResponse = await axios.get('/clients', {
        params: { page: 1, pageSize: 16 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      expect(listResponse.status).toBe(200);
      expect(Array.isArray(listResponse.data.data)).toBe(true);
      expect(
        listResponse.data.data.some((client: { id: string }) => client.id === createdClientId),
      ).toBe(true);

      const getResponse = await axios.get(`/clients/${createdClientId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.id).toBe(createdClientId);
      expect(getResponse.data.accessCount).toBeGreaterThanOrEqual(1);

      const updateResponse = await axios.patch(
        `/clients/${createdClientId}`,
        {
          name: 'Cliente E2E Atualizado',
          salary: 14000,
          companyValuation: 390000,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.name).toBe('Cliente E2E Atualizado');
      expect(updateResponse.data.salary).toBe(14000);
      expect(updateResponse.data.companyValuation).toBe(390000);

      const financialHistoryResponse = await axios.get(
        `/clients/financial-history/${createdClientId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      expect(financialHistoryResponse.status).toBe(200);
      expect(financialHistoryResponse.data).toHaveLength(2);
      expect(financialHistoryResponse.data[0].clientId).toBe(createdClientId);
      expect(
        financialHistoryResponse.data.map((historyItem: { field: string }) => historyItem.field),
      ).toEqual(expect.arrayContaining(['companyValuation', 'salary']));

      const deleteResponse = await axios.delete(`/clients/${createdClientId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      expect(deleteResponse.status).toBe(204);
      const deletedClientId = createdClientId;
      createdClientId = '';

      try {
        await axios.get(`/clients/${deletedClientId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        fail('Expected get client after delete to fail');
      } catch (error) {
        const axiosError = error as AxiosError;
        expect(axiosError.response?.status).toBe(404);
      }
    } finally {
      if (createdClientId && accessToken) {
        await axios.delete(`/clients/${createdClientId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => undefined);
      }
    }
  });

  it('rejects clients access without token', async () => {
    try {
      await axios.get('/clients');
      fail('Expected unauthorized request to fail');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(401);
    }
  });
});
