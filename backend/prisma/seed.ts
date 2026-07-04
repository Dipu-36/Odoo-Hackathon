import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('Password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hrms.com' },
    update: {},
    create: {
      employeeId: 'EMP-001',
      email: 'admin@hrms.com',
      password,
      role: 'ADMIN',
      isVerified: true,
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          phone: '+1 555-0100',
          department: 'Human Resources',
          designation: 'HR Director',
        },
      },
    },
  });

  const employees = [
    {
      employeeId: 'EMP-002',
      email: 'alice@hrms.com',
      firstName: 'Alice',
      lastName: 'Williams',
      phone: '+1 555-0101',
      department: 'Engineering',
      designation: 'Senior Developer',
    },
    {
      employeeId: 'EMP-003',
      email: 'bob@hrms.com',
      firstName: 'Bob',
      lastName: 'Brown',
      phone: '+1 555-0102',
      department: 'Engineering',
      designation: 'Frontend Developer',
    },
    {
      employeeId: 'EMP-004',
      email: 'carol@hrms.com',
      firstName: 'Carol',
      lastName: 'Davis',
      phone: '+1 555-0103',
      department: 'Marketing',
      designation: 'Marketing Manager',
    },
    {
      employeeId: 'EMP-005',
      email: 'david@hrms.com',
      firstName: 'David',
      lastName: 'Miller',
      phone: '+1 555-0104',
      department: 'Sales',
      designation: 'Sales Executive',
    },
    {
      employeeId: 'EMP-006',
      email: 'eve@hrms.com',
      firstName: 'Eve',
      lastName: 'Wilson',
      phone: '+1 555-0105',
      department: 'Finance',
      designation: 'Financial Analyst',
    },
    {
      employeeId: 'EMP-007',
      email: 'frank@hrms.com',
      firstName: 'Frank',
      lastName: 'Taylor',
      phone: '+1 555-0106',
      department: 'Engineering',
      designation: 'DevOps Engineer',
    },
  ];

  for (const emp of employees) {
    await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        employeeId: emp.employeeId,
        email: emp.email,
        password,
        role: 'EMPLOYEE',
        isVerified: true,
        profile: {
          create: {
            firstName: emp.firstName,
            lastName: emp.lastName,
            phone: emp.phone,
            department: emp.department,
            designation: emp.designation,
          },
        },
      },
    });
  }

  const allUsers = await prisma.user.findMany();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const user of allUsers) {
    const hasAttendance = await prisma.attendance.findFirst({
      where: { userId: user.id, date: today },
    });

    if (!hasAttendance) {
      const checkInTime = new Date();
      checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

      const shouldCheckOut = Math.random() > 0.3;
      const checkOutTime = new Date(checkInTime);
      checkOutTime.setHours(checkInTime.getHours() + 8);

      await prisma.attendance.create({
        data: {
          userId: user.id,
          date: today,
          checkIn: checkInTime,
          checkOut: shouldCheckOut ? checkOutTime : null,
        },
      });
    }
  }

  const emp1 = allUsers.find((u) => u.email === 'alice@hrms.com')!;
  const emp2 = allUsers.find((u) => u.email === 'bob@hrms.com')!;
  const emp3 = allUsers.find((u) => u.email === 'carol@hrms.com')!;
  const emp4 = allUsers.find((u) => u.email === 'david@hrms.com')!;

  const leaveDate1 = new Date();
  leaveDate1.setDate(leaveDate1.getDate() + 3);
  const leaveDate2 = new Date(leaveDate1);
  leaveDate2.setDate(leaveDate2.getDate() + 2);

  const leaveDate3 = new Date();
  leaveDate3.setDate(leaveDate3.getDate() + 7);
  const leaveDate4 = new Date(leaveDate3);
  leaveDate4.setDate(leaveDate4.getDate() + 1);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 10);
  const pastDate2 = new Date(pastDate);
  pastDate2.setDate(pastDate2.getDate() + 4);

  await prisma.leaveRequest.createMany({
    data: [
      {
        userId: emp1.id,
        type: 'CASUAL',
        from: leaveDate1,
        to: leaveDate2,
        remarks: 'Family vacation',
        status: 'PENDING',
      },
      {
        userId: emp2.id,
        type: 'SICK',
        from: leaveDate3,
        to: leaveDate4,
        remarks: 'Medical appointment',
        status: 'PENDING',
      },
      {
        userId: emp3.id,
        type: 'EARNED',
        from: pastDate,
        to: pastDate2,
        remarks: 'Annual trip',
        status: 'APPROVED',
        comments: 'Enjoy your trip!',
      },
      {
        userId: emp4.id,
        type: 'UNPAID',
        from: pastDate,
        to: pastDate2,
        remarks: 'Personal work',
        status: 'REJECTED',
        comments: 'Please reschedule after month-end.',
      },
    ],
    skipDuplicates: true,
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  for (const user of allUsers) {
    const existing = await prisma.payroll.findUnique({
      where: { userId_month: { userId: user.id, month: currentMonth } },
    });

    if (!existing) {
      const baseSalary = 3000 + Math.floor(Math.random() * 5000);
      const allowances = 500 + Math.floor(Math.random() * 1500);
      const deductions = 200 + Math.floor(Math.random() * 500);
      await prisma.payroll.create({
        data: {
          userId: user.id,
          month: currentMonth,
          basicSalary: baseSalary,
          allowances,
          deductions,
          netSalary: baseSalary + allowances - deductions,
        },
      });
    }
  }

  console.log('Seed completed!');
  console.log('Admin login: admin@hrms.com / Password123');
  console.log('Employee login: alice@hrms.com / Password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
