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
      address: 'Av. Libertador 1000, CABA',
    },
  });

  const cliente = await prisma.user.create({
    data: {
      email: 'cliente@urbanfix.com',
      password: clientePassword,
      name: 'María García',
      role: 'CLIENTE',
      phone: '+541100000002',
      address: 'Av. Corrientes 1234, CABA',
    },
  });

  const tecnico = await prisma.user.create({
    data: {
      email: 'tecnico@urbanfix.com',
      password: tecnicoPassword,
      name: 'Carlos López',
      role: 'TECNICO',
      phone: '+541100000003',
      address: 'Calle Belgrano 567, CABA',
      imageUrl:
        'https://res.cloudinary.com/urbanfix/image/upload/v1234567890/tecnico1.jpg',
    },
  });

  console.log('Usuarios creados:');
  console.log(`  ADMIN:   ${admin.email} (id: ${admin.id})`);
  console.log(`  CLIENTE: ${cliente.email} (id: ${cliente.id})`);
  console.log(`  TECNICO: ${tecnico.email} (id: ${tecnico.id})`);

  console.log('\nCreando solicitudes de servicio...');

  // Solicitud PENDIENTE (sin técnico) - PLOMERIA
  const solicitud1 = await prisma.serviceRequest.create({
    data: {
      title: 'Fuga de agua en cocina',
      description:
        'Hay una fuga debajo de la pileta de la cocina que moja el piso. Necesito que revisen las cañerías.',
      category: 'PLOMERIA',
      status: 'PENDIENTE',
      address: 'Av. Corrientes 1234, CABA',
      scheduledDate: new Date('2026-08-15T10:00:00.000Z'),
      clienteId: cliente.id,
    },
  });

  // Solicitud PENDIENTE (sin técnico) - ELECTRICIDAD
  const solicitud2 = await prisma.serviceRequest.create({
    data: {
      title: 'Enchufe quemado',
      description:
        'El enchufe de la habitación principal dejó de funcionar y tiene marcas de quemado. Necesito que lo revisen urgente.',
      category: 'ELECTRICIDAD',
      status: 'PENDIENTE',
      address: 'Av. Santa Fe 567, CABA',
      scheduledDate: new Date('2026-08-16T14:00:00.000Z'),
      clienteId: cliente.id,
    },
  });

  // Solicitud ACEPTADA (asignada al técnico) - INFORMATICA
  const solicitud3 = await prisma.serviceRequest.create({
    data: {
      title: 'Configuración de red Wi-Fi',
      description:
        'Necesito configurar el router y mejorar la señal Wi-Fi en toda la casa. También instalar un repetidor.',
      category: 'INFORMATICA',
      status: 'ACEPTADA',
      address: 'Calle Defensa 890, CABA',
      scheduledDate: new Date('2026-08-12T09:00:00.000Z'),
      clienteId: cliente.id,
      tecnicoId: tecnico.id,
    },
  });

  // Solicitud EN_PROGRESO (asignada al técnico) - GASISTAS
  const solicitud4 = await prisma.serviceRequest.create({
    data: {
      title: 'Revisión de calefón',
      description:
        'El calefón no enciende correctamente, hace ruido y el agua sale fría. Necesito revisión completa.',
      category: 'GASISTAS',
      status: 'EN_PROGRESO',
      address: 'Calle Florida 456, CABA',
      scheduledDate: new Date('2026-08-10T15:00:00.000Z'),
      clienteId: cliente.id,
      tecnicoId: tecnico.id,
    },
  });

  // Solicitud COMPLETADA - PLOMERIA
  const solicitud5 = await prisma.serviceRequest.create({
    data: {
      title: 'Instalación de grifería nueva',
      description:
        'Cambiar grifería de la cocina y el baño por modelos modernos. Incluye instalación completa.',
      category: 'PLOMERIA',
      status: 'COMPLETADA',
      address: 'Av. Rivadavia 2000, CABA',
      scheduledDate: new Date('2026-08-05T11:00:00.000Z'),
      clienteId: cliente.id,
      tecnicoId: tecnico.id,
    },
  });

  // Solicitud RECHAZADA - ELECTRICIDAD
  const solicitud6 = await prisma.serviceRequest.create({
    data: {
      title: 'Cambio de tablero eléctrico',
      description:
        'El tablero eléctrico es muy antiguo y necesita ser reemplazado por uno moderno con térmicas nuevas.',
      category: 'ELECTRICIDAD',
      status: 'RECHAZADA',
      address: 'Calle San Martín 789, CABA',
      scheduledDate: new Date('2026-08-18T16:00:00.000Z'),
      clienteId: cliente.id,
      tecnicoId: tecnico.id,
    },
  });

  // Solicitud CANCELADA - INFORMATICA
  const solicitud7 = await prisma.serviceRequest.create({
    data: {
      title: 'Instalación de impresora',
      description:
        'Necesito instalar una impresora multifunción en la red de la oficina.',
      category: 'INFORMATICA',
      status: 'CANCELADA',
      address: 'Av. Libertador 3000, CABA',
      scheduledDate: new Date('2026-08-20T08:00:00.000Z'),
      clienteId: cliente.id,
    },
  });

  // Solicitud sin técnico asignado - GASISTAS (para técnico disponible)
  const solicitud8 = await prisma.serviceRequest.create({
    data: {
      title: 'Fuga de gas en cocina',
      description:
        'Se detectó olor a gas cerca de la cocina. Necesito revisión urgente por seguridad.',
      category: 'GASISTAS',
      status: 'PENDIENTE',
      address: 'Av. Cabildo 1234, CABA',
      scheduledDate: new Date('2026-08-13T12:00:00.000Z'),
      clienteId: cliente.id,
    },
  });

  console.log('Solicitudes creadas:');
  console.log(
    `  #${solicitud1.id} - ${solicitud1.title} [${solicitud1.status}] - ${solicitud1.category}`,
  );
  console.log(
    `  #${solicitud2.id} - ${solicitud2.title} [${solicitud2.status}] - ${solicitud2.category}`,
  );
  console.log(
    `  #${solicitud3.id} - ${solicitud3.title} [${solicitud3.status}] - ${solicitud3.category}`,
  );
  console.log(
    `  #${solicitud4.id} - ${solicitud4.title} [${solicitud4.status}] - ${solicitud4.category}`,
  );
  console.log(
    `  #${solicitud5.id} - ${solicitud5.title} [${solicitud5.status}] - ${solicitud5.category}`,
  );
  console.log(
    `  #${solicitud6.id} - ${solicitud6.title} [${solicitud6.status}] - ${solicitud6.category}`,
  );
  console.log(
    `  #${solicitud7.id} - ${solicitud7.title} [${solicitud7.status}] - ${solicitud7.category}`,
  );
  console.log(
    `  #${solicitud8.id} - ${solicitud8.title} [${solicitud8.status}] - ${solicitud8.category}`,
  );

  console.log('\n--- Seed completado ---');
  console.log('\n📊 Resumen de estados:');
  console.log(`  PENDIENTE:  ${[solicitud1, solicitud2, solicitud8].length}`);
  console.log(`  ACEPTADA:   ${[solicitud3].length}`);
  console.log(`  EN_PROGRESO: ${[solicitud4].length}`);
  console.log(`  COMPLETADA: ${[solicitud5].length}`);
  console.log(`  RECHAZADA:  ${[solicitud6].length}`);
  console.log(`  CANCELADA:  ${[solicitud7].length}`);

  console.log('\n🔑 Credenciales de prueba:');
  console.log('  ADMIN:   admin@urbanfix.com / admin123');
  console.log('  CLIENTE: cliente@urbanfix.com / cliente123');
  console.log('  TECNICO: tecnico@urbanfix.com / tecnico123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
