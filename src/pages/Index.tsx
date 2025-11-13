import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'manager' | 'client';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  const handleLogin = (role: UserRole) => {
    const user: User = {
      id: role === 'manager' ? 1 : 2,
      email: role === 'manager' ? 'manager@rental.com' : 'client1@example.com',
      fullName: role === 'manager' ? 'Иванов Иван Иванович' : 'Петров Петр Петрович',
      role
    };
    setCurrentUser(user);
    toast({
      title: 'Вход выполнен',
      description: `Добро пожаловать, ${user.fullName}`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    toast({
      title: 'Выход выполнен',
      description: 'До встречи!',
    });
  };

  const handleDownloadPDF = (contractNumber: string) => {
    toast({
      title: 'Формирование PDF',
      description: `Договор ${contractNumber} готовится к скачиванию...`,
    });
  };

  const handleAddEquipment = () => {
    toast({
      title: 'Оборудование добавлено',
      description: 'Новая единица техники добавлена в каталог',
    });
  };

  const handleRentEquipment = (equipmentName: string) => {
    toast({
      title: 'Оформление аренды',
      description: `Создан договор на ${equipmentName}`,
    });
  };

  const handleExportReport = (format: string, reportName: string) => {
    toast({
      title: `Экспорт в ${format}`,
      description: `Отчет "${reportName}" подготовлен к скачиванию`,
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Package" size={32} className="text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Система аренды оборудования</CardTitle>
            <CardDescription>Выберите роль для входа в систему</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => handleLogin('manager')} 
              className="w-full h-14 text-lg"
              size="lg"
            >
              <Icon name="UserCog" size={24} className="mr-2" />
              Войти как менеджер
            </Button>
            <Button 
              onClick={() => handleLogin('client')} 
              variant="outline"
              className="w-full h-14 text-lg"
              size="lg"
            >
              <Icon name="User" size={24} className="mr-2" />
              Войти как клиент
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RentEquip Pro</h1>
              <p className="text-xs text-muted-foreground">Система аренды оборудования</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser.fullName}</p>
              <Badge variant={currentUser.role === 'manager' ? 'default' : 'secondary'} className="text-xs">
                {currentUser.role === 'manager' ? 'Менеджер' : 'Клиент'}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="LayoutDashboard" size={16} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Icon name="Wrench" size={16} />
              Оборудование
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Аренды
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2" disabled={currentUser.role === 'client'}>
              <Icon name="Users" size={16} />
              Клиенты
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center gap-2">
              <Icon name="DollarSign" size={16} />
              Финансы
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2" disabled={currentUser.role === 'client'}>
              <Icon name="BarChart3" size={16} />
              Отчеты
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2" disabled={currentUser.role === 'client'}>
              <Icon name="Settings" size={16} />
              Админ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Выручка за месяц</CardTitle>
                  <Icon name="TrendingUp" className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₽ 234,500</div>
                  <p className="text-xs text-muted-foreground">+12% к прошлому месяцу</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активные аренды</CardTitle>
                  <Icon name="FileText" className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">3 завершаются сегодня</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Загрузка оборудования</CardTitle>
                  <Icon name="Package" className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67%</div>
                  <p className="text-xs text-muted-foreground">24 из 36 единиц в аренде</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Задолженности</CardTitle>
                  <Icon name="AlertCircle" className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₽ 45,200</div>
                  <p className="text-xs text-muted-foreground">5 клиентов с просрочкой</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Популярное оборудование</CardTitle>
                  <CardDescription>Топ-5 по количеству аренд</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Телескопический погрузчик', rentals: 45, revenue: 180000 },
                      { name: 'Компрессор винтовой', rentals: 38, revenue: 95000 },
                      { name: 'Бетономешалка', rentals: 32, revenue: 38400 },
                      { name: 'Генератор бензиновый', rentals: 28, revenue: 42000 },
                      { name: 'Отбойный молоток', rentals: 25, revenue: 22500 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.rentals} аренд</p>
                        </div>
                        <p className="text-sm font-bold">₽ {item.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Последние операции</CardTitle>
                  <CardDescription>Недавние договоры и платежи</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'payment', client: 'ООО СтройМонтаж', amount: 14400, time: '2 часа назад' },
                      { type: 'rental', client: 'ИП Сидоров', equipment: 'Отбойный молоток', time: '4 часа назад' },
                      { type: 'payment', client: 'ООО ТехСервис', amount: 9000, time: '6 часов назад' },
                      { type: 'rental', client: 'ООО СтройМонтаж', equipment: 'Бетономешалка', time: 'Вчера' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.type === 'payment' ? 'bg-accent/10' : 'bg-primary/10'
                        }`}>
                          <Icon 
                            name={item.type === 'payment' ? 'DollarSign' : 'FileText'} 
                            size={16} 
                            className={item.type === 'payment' ? 'text-accent' : 'text-primary'}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.client}</p>
                          <p className="text-xs text-muted-foreground">
                            {'amount' in item ? `Оплата ₽${item.amount.toLocaleString()}` : `Аренда: ${item.equipment}`}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Каталог оборудования</h2>
                <p className="text-muted-foreground">Управление техникой и инвентарем</p>
              </div>
              {currentUser.role === 'manager' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить оборудование
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новое оборудование</DialogTitle>
                      <DialogDescription>Добавление единицы техники в каталог</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Инвентарный номер</Label>
                        <Input placeholder="EQ-2025-XXX" />
                      </div>
                      <div className="space-y-2">
                        <Label>Название</Label>
                        <Input placeholder="Название оборудования" />
                      </div>
                      <div className="space-y-2">
                        <Label>Категория</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Строительное оборудование</SelectItem>
                            <SelectItem value="2">Садовая техника</SelectItem>
                            <SelectItem value="3">Электроинструменты</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Стоимость аренды (₽/день)</Label>
                        <Input type="number" placeholder="1000" />
                      </div>
                      <Button className="w-full" onClick={handleAddEquipment}>Добавить</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { id: 1, name: 'Перфоратор Bosch GBH 2-28', inventory: 'EQ-2025-001', rate: 500, status: 'available' },
                { id: 2, name: 'Бетономешалка 180л', inventory: 'EQ-2025-002', rate: 1200, status: 'rented' },
                { id: 3, name: 'Газонокосилка Husqvarna', inventory: 'EQ-2025-003', rate: 800, status: 'available' },
                { id: 4, name: 'Компрессор винтовой 500л', inventory: 'EQ-2025-004', rate: 2500, status: 'available' },
                { id: 5, name: 'Строительный пылесос Karcher', inventory: 'EQ-2025-005', rate: 600, status: 'maintenance' },
                { id: 6, name: 'Генератор бензиновый 5кВт', inventory: 'EQ-2025-006', rate: 1500, status: 'available' }
              ].map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{item.inventory}</CardDescription>
                      </div>
                      <Badge variant={
                        item.status === 'available' ? 'default' : 
                        item.status === 'rented' ? 'secondary' : 'outline'
                      }>
                        {item.status === 'available' ? 'Свободно' : 
                         item.status === 'rented' ? 'В аренде' : 'Обслуживание'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">₽ {item.rate}</p>
                        <p className="text-xs text-muted-foreground">за день</p>
                      </div>
                      {item.status === 'available' && (
                        <Button size="sm" onClick={() => handleRentEquipment(item.name)}>
                          <Icon name="Plus" size={14} className="mr-1" />
                          Арендовать
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rentals" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Договоры аренды</h2>
                <p className="text-muted-foreground">Управление текущими и завершенными арендами</p>
              </div>
              {currentUser.role === 'manager' && (
                <Button>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Новый договор
                </Button>
              )}
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер договора</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Оборудование</TableHead>
                      <TableHead>Период</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        number: 'DOG-2025-001', 
                        client: 'ООО СтройМонтаж', 
                        equipment: 'Бетономешалка 180л',
                        start: '01.11.2025',
                        end: '15.11.2025',
                        amount: 18000,
                        status: 'active'
                      },
                      { 
                        number: 'DOG-2025-002', 
                        client: 'ИП Сидоров С.С.', 
                        equipment: 'Отбойный молоток',
                        start: '05.11.2025',
                        end: '20.11.2025',
                        amount: 14400,
                        status: 'active'
                      },
                      { 
                        number: 'DOG-2025-003', 
                        client: 'ООО СтройМонтаж', 
                        equipment: 'Перфоратор Bosch',
                        start: '20.10.2025',
                        end: '05.11.2025',
                        amount: 8000,
                        status: 'completed'
                      }
                    ].map((rental) => (
                      <TableRow key={rental.number}>
                        <TableCell className="font-medium">{rental.number}</TableCell>
                        <TableCell>{rental.client}</TableCell>
                        <TableCell>{rental.equipment}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{rental.start} - {rental.end}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">₽ {rental.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={rental.status === 'active' ? 'default' : 'secondary'}>
                            {rental.status === 'active' ? 'Активна' : 'Завершена'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(rental.number)}>
                            <Icon name="Download" size={14} className="mr-1" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">База клиентов</h2>
                <p className="text-muted-foreground">Управление контактами и историей операций</p>
              </div>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить клиента
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'ООО "СтройМонтаж"', contact: 'Петров П.П.', phone: '+7 (999) 234-56-78', balance: 15000, rentals: 12 },
                { name: 'ИП Сидоров С.С.', contact: 'Сидоров С.С.', phone: '+7 (999) 345-67-89', balance: 8000, rentals: 8 },
                { name: 'ООО "ТехСервис"', contact: 'Иванова М.И.', phone: '+7 (999) 456-78-90', balance: -5000, rentals: 15 }
              ].map((client, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <CardDescription>{client.contact}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Icon name="Phone" size={14} className="mr-2 text-muted-foreground" />
                      {client.phone}
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Баланс</p>
                        <p className={`text-sm font-bold ${client.balance < 0 ? 'text-destructive' : 'text-accent'}`}>
                          ₽ {Math.abs(client.balance).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Аренд</p>
                        <p className="text-sm font-bold">{client.rentals}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finances" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Финансы</h2>
              <p className="text-muted-foreground">Платежи, задолженности и финансовая аналитика</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Поступления за месяц</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">₽ 234,500</div>
                  <p className="text-xs text-muted-foreground mt-2">+18% к прошлому периоду</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ожидается платежей</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">₽ 67,800</div>
                  <p className="text-xs text-muted-foreground mt-2">8 активных договоров</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Просроченные платежи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">₽ 45,200</div>
                  <p className="text-xs text-muted-foreground mt-2">5 клиентов</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Последние платежи</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Договор</TableHead>
                      <TableHead>Способ оплаты</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '13.11.2025', client: 'ООО СтройМонтаж', contract: 'DOG-2025-001', method: 'Безналичный', amount: 9000 },
                      { date: '12.11.2025', client: 'ИП Сидоров', contract: 'DOG-2025-002', method: 'Наличные', amount: 14400 },
                      { date: '10.11.2025', client: 'ООО ТехСервис', contract: 'DOG-2025-005', method: 'Безналичный', amount: 8000 }
                    ].map((payment, i) => (
                      <TableRow key={i}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.client}</TableCell>
                        <TableCell className="font-medium">{payment.contract}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell className="text-right font-semibold">₽ {payment.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Отчеты и аналитика</h2>
              <p className="text-muted-foreground">Статистика и выгрузки данных</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Отчет по выручке</CardTitle>
                      <CardDescription>Помесячная аналитика доходов</CardDescription>
                    </div>
                    <Icon name="TrendingUp" size={24} className="text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('PDF', 'Отчет по выручке')}>
                      <Icon name="FileText" size={14} className="mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Excel', 'Отчет по выручке')}>
                      <Icon name="FileSpreadsheet" size={14} className="mr-1" />
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Загрузка оборудования</CardTitle>
                      <CardDescription>Анализ использования техники</CardDescription>
                    </div>
                    <Icon name="Package" size={24} className="text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('PDF', 'Загрузка оборудования')}>
                      <Icon name="FileText" size={14} className="mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Excel', 'Загрузка оборудования')}>
                      <Icon name="FileSpreadsheet" size={14} className="mr-1" />
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Просрочки и задолженности</CardTitle>
                      <CardDescription>Контроль дебиторской задолженности</CardDescription>
                    </div>
                    <Icon name="AlertCircle" size={24} className="text-destructive" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('PDF', 'Просрочки и задолженности')}>
                      <Icon name="FileText" size={14} className="mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Excel', 'Просрочки и задолженности')}>
                      <Icon name="FileSpreadsheet" size={14} className="mr-1" />
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>История клиентов</CardTitle>
                      <CardDescription>Детализация по клиентам</CardDescription>
                    </div>
                    <Icon name="Users" size={24} className="text-warning" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('PDF', 'История клиентов')}>
                      <Icon name="FileText" size={14} className="mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Excel', 'История клиентов')}>
                      <Icon name="FileSpreadsheet" size={14} className="mr-1" />
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Администрирование</h2>
              <p className="text-muted-foreground">Настройки системы и управление пользователями</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Управление пользователями</CardTitle>
                  <CardDescription>Создание и настройка прав доступа</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Добавить пользователя
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Аудит системы</CardTitle>
                  <CardDescription>История действий пользователей</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Icon name="FileSearch" size={16} className="mr-2" />
                    Просмотреть логи
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Резервное копирование</CardTitle>
                  <CardDescription>Управление бэкапами базы данных</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Icon name="Database" size={16} className="mr-2" />
                    Создать резервную копию
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Настройки системы</CardTitle>
                  <CardDescription>Общие параметры работы</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Icon name="Settings" size={16} className="mr-2" />
                    Открыть настройки
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;