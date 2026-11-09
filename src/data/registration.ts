export type RegistrationData = {
  fullName: string;
  email: string;
  password: string;
};

const firstNames = ['Ana', 'Bruno', 'Carla', 'Diego', 'Fernanda', 'Gabriel', 'Juliana', 'Lucas'];
const lastNames = ['Silva', 'Souza', 'Oliveira', 'Pereira', 'Costa', 'Almeida', 'Ribeiro', 'Lima'];

function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function buildValidUser(): RegistrationData {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const firstName = pickRandom(firstNames);
  const lastName = pickRandom(lastNames);

  return {
    fullName: `${firstName} ${lastName}`,
    email: `${firstName}.${lastName}.${id}@exemplo.com`.toLowerCase(),
    password: 'SenhaSegura123',
  };
}