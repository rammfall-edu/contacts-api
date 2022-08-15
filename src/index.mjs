import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

let id = 2;

const contacts = {
  0: {
    name: 'Student friend',
    id: 0,
    number: '+380630203212',
  },
  1: {
    name: 'Student hater',
    id: 1,
    number: '+380509856143',
  },
};

fastify.register(
  (instance, opts, done) => {
    instance.get('/contacts', (request, reply) => {
      reply.send(contacts);
    });

    instance.post(
      '/contacts',
      {
        schema: {
          body: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 4,
                maxLength: 20,
              },
              number: {
                type: 'string',
                minLength: 12,
                maxLength: 20,
              },
            },
            required: ['name', 'number'],
          },
        },
      },
      (request, reply) => {
        const { name, number } = request.body;

        const currentId = id++;
        const contact = {
          name,
          number,
          id: currentId,
        };
        contacts[currentId] = contact;
        reply.send(contact);
      }
    );

    done();
  },
  { prefix: '/api' }
);

export default fastify;
