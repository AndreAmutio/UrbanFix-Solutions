import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('Limpiando base de datos...');
  await prisma.serviceRequest.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creando usuarios...');

  const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
  const clientePassword = await bcrypt.hash('cliente123', SALT_ROUNDS);
  const tecnicoPassword = await bcrypt.hash('tecnico123', SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@urbanfix.com',
      password: adminPassword,
      name: 'Admin Principal',
      role: 'ADMIN',
      phone: '+541100000001',
    },
  });

  const cliente = await prisma.user.create({
    data: {
      email: 'cliente@urbanfix.com',
      password: clientePassword,
      name: 'María García',
      role: 'CLIENTE',
      phone: '+541100000002',
    },
  });

  const tecnico = await prisma.user.create({
    data: {
      email: 'tecnico@urbanfix.com',
      password: tecnicoPassword,
      name: 'Carlos López',
      role: 'TECNICO',
      phone: '+541100000003',
    },
  });

  console.log('Usuarios creados:');
  console.log(`  ADMIN:   ${admin.email} (id: ${admin.id})`);
  console.log(`  CLIENTE: ${cliente.email} (id: ${cliente.id})`);
  console.log(`  TECNICO: ${tecnico.email} (id: ${tecnico.id})`);

  console.log('\nCreando solicitudes de servicio...');

  // Solicitud PENDIENTE (sin técnico)
  const solicitud1 = await prisma.serviceRequest.create({
    data: {
      title: 'Fuga de agua en cocina',
      description: 'Hay una fuga debajo de la pileta de la cocina que moja el piso.',
      category: 'Plomería',
      status: 'PENDIENTE',
      address: 'Av. Corrientes 1234, CABA',
      clienteId: cliente.id,
    },
  });

  // Solicitud PENDIENTE (sin técnico) - otra más para tener variedad
  const solicitud2 = await prisma.serviceRequest.create({
    data: {
      title: 'Enchufe quemado',
      description: 'El enchufe de la habitación principal dejó de funcionar y tiene marcas de quemado.',
      category: 'Electricidad',
      status: 'PENDIENTE',
      address: 'Av. Santa Fe 567, CABA',
      clienteId: cliente.id,
    },
  });

  // Solicitud ACEPTADA (asignada al técnico)
  const solicitud3 = await prisma.serviceRequest.create({
    data: {
      title: 'Cerradura trabada',
      description: 'La cerradura de la puerta principal no gira correctamente.',
      category: 'Cerrajería',
      status: 'ACEPTADA',
      address: 'Calle Defensa 890, CABA',
      clienteId: cliente.id,
      tecnicoId: tecnico.id,
    },
  });

  // Solicitud EN_PROGRESO (asignada al técnico)
  const solicitud4 = await prisma.serviceRequest.create({
    data: {
      title: 'Pintura de living',
      description: 'Pintar las paredes del living, aproximadamente 40m2.',
      category: 'Pintura',
      status: 'EN_PROGRESO',
      address: 'Calle Florida 456, CABA',
      clienteId: cliente.id,
      tecnicoId: tecnico.id,
    },
  });

  // Solicitud COMPLETADA
  const solicitud5 = await prisma.serviceRequest.create({
    data: {
      title: 'Instalación de aire acondicionado',
      description: 'Instalar split de 3000 frigorías en dormitorio.',
      category: 'Refrigeración',
      status: 'COMPLETADA',
      address: 'Av. Rivadavia 2000, CABA',
      clienteId: cliente.id,
      tecnicoId: tecnico.id,
    },
  });

  console.log('Solicitudes creadas:');
  console.log(`  #${solicitud1.id} - ${solicitud1.title} [${solicitud1.status}]`);
  console.log(`  #${solicitud2.id} - ${solicitud2.title} [${solicitud2.status}]`);
  console.log(`  #${solicitud3.id} - ${solicitud3.title} [${solicitud3.status}]`);
  console.log(`  #${solicitud4.id} - ${solicitud4.title} [${solicitud4.status}]`);
  console.log(`  #${solicitud5.id} - ${solicitud5.title} [${solicitud5.status}]`);

  console.log('\n--- Seed completado ---');
  console.log('\nCredenciales de prueba:');
  console.log('  ADMIN:   admin@urbanfix.com / admin123');
  console.log('  CLIENTE: cliente@urbanfix.com / cliente123');
  console.log('  TECNICO: tecnico@urbanfix.com / tecnico123');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
