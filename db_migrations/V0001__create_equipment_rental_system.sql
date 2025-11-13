-- Создание схемы для системы аренды оборудования

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'client')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица клиентов (расширенная информация)
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company_name VARCHAR(255),
    inn VARCHAR(20),
    address TEXT,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий оборудования
CREATE TABLE IF NOT EXISTS equipment_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Таблица оборудования
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    inventory_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES equipment_categories(id),
    description TEXT,
    specifications JSONB,
    daily_rate DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'rented', 'maintenance', 'repair')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица договоров аренды
CREATE TABLE IF NOT EXISTS rental_contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    equipment_id INTEGER REFERENCES equipment(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'cancelled', 'overdue')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица платежей
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES rental_contracts(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица истории изменения статусов оборудования
CREATE TABLE IF NOT EXISTS equipment_status_history (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_rental_contracts_status ON rental_contracts(status);
CREATE INDEX IF NOT EXISTS idx_rental_contracts_dates ON rental_contracts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);

-- Вставка тестовых данных

-- Категории оборудования
INSERT INTO equipment_categories (name, description) VALUES
('Строительное оборудование', 'Инструменты и техника для строительства'),
('Садовая техника', 'Оборудование для садовых работ'),
('Электроинструменты', 'Электрические инструменты'),
('Грузоподъемное оборудование', 'Краны, подъемники'),
('Компрессоры и генераторы', 'Энергетическое оборудование');

-- Тестовые пользователи
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('manager@rental.com', '$2a$10$abcdefghijklmnopqrstuv', 'Иванов Иван Иванович', '+7 (999) 123-45-67', 'manager'),
('client1@example.com', '$2a$10$abcdefghijklmnopqrstuv', 'Петров Петр Петрович', '+7 (999) 234-56-78', 'client'),
('client2@example.com', '$2a$10$abcdefghijklmnopqrstuv', 'Сидоров Сергей Сергеевич', '+7 (999) 345-67-89', 'client');

-- Клиенты
INSERT INTO clients (user_id, company_name, inn, address, balance) VALUES
(2, 'ООО "СтройМонтаж"', '7701234567', 'Москва, ул. Строителей, 10', 15000.00),
(3, 'ИП Сидоров С.С.', '770987654321', 'Москва, ул. Садовая, 25', 8000.00);

-- Оборудование
INSERT INTO equipment (inventory_number, name, category_id, description, specifications, daily_rate, status) VALUES
('EQ-2025-001', 'Перфоратор Bosch GBH 2-28', 3, 'Мощный перфоратор для профессионального использования', '{"мощность": "880 Вт", "энергия_удара": "3.2 Дж", "вес": "3.1 кг"}', 500.00, 'available'),
('EQ-2025-002', 'Бетономешалка 180л', 1, 'Бетоносмеситель для строительных работ', '{"объем": "180 л", "мощность": "800 Вт"}', 1200.00, 'rented'),
('EQ-2025-003', 'Газонокосилка Husqvarna', 2, 'Бензиновая газонокосилка', '{"ширина_скашивания": "53 см", "объем_двигателя": "160 см³"}', 800.00, 'available'),
('EQ-2025-004', 'Компрессор винтовой 500л', 5, 'Промышленный компрессор', '{"производительность": "500 л/мин", "давление": "10 бар"}', 2500.00, 'available'),
('EQ-2025-005', 'Строительный пылесос Karcher', 1, 'Промышленный пылесос', '{"мощность": "1400 Вт", "объем_бака": "30 л"}', 600.00, 'maintenance'),
('EQ-2025-006', 'Генератор бензиновый 5кВт', 5, 'Портативный генератор', '{"мощность": "5 кВт", "топливо": "бензин"}', 1500.00, 'available'),
('EQ-2025-007', 'Отбойный молоток', 1, 'Электрический отбойный молоток', '{"мощность": "1700 Вт", "энергия_удара": "45 Дж"}', 900.00, 'rented'),
('EQ-2025-008', 'Телескопический погрузчик', 4, 'Телескопический погрузчик 4м', '{"высота_подъема": "4 м", "грузоподъемность": "2500 кг"}', 4000.00, 'available');

-- Договоры аренды
INSERT INTO rental_contracts (contract_number, client_id, equipment_id, start_date, end_date, daily_rate, total_amount, status) VALUES
('DOG-2025-001', 1, 2, '2025-11-01', '2025-11-15', 1200.00, 18000.00, 'active'),
('DOG-2025-002', 2, 7, '2025-11-05', '2025-11-20', 900.00, 14400.00, 'active'),
('DOG-2025-003', 1, 1, '2025-10-20', '2025-11-05', 500.00, 8000.00, 'completed'),
('DOG-2025-004', 2, 3, '2025-10-15', '2025-10-30', 800.00, 12000.00, 'completed');

-- Платежи
INSERT INTO payments (contract_id, amount, payment_date, payment_method, status) VALUES
(1, 9000.00, '2025-11-01', 'Безналичный расчет', 'completed'),
(2, 14400.00, '2025-11-05', 'Наличные', 'completed'),
(3, 8000.00, '2025-10-20', 'Безналичный расчет', 'completed'),
(4, 12000.00, '2025-10-15', 'Безналичный расчет', 'completed');