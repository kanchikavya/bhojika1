import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'food_fiesta.sqlite3')
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.executescript('''
CREATE TABLE user1(
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    f_name VARCHAR(30) NOT NULL,
    address VARCHAR(50),
    mobile_no BIGINT NOT NULL,
    email VARCHAR(50) UNIQUE
);

CREATE TABLE orders1(
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user1(userid),
    item VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE returns1(
    return_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user1(userid),
    order_id INTEGER NOT NULL REFERENCES orders1(order_id),
    item VARCHAR(50),
    amount DECIMAL(10,2)
);

CREATE TABLE complaint1(
    complaint_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user1(userid),
    order_id INTEGER NOT NULL REFERENCES orders1(order_id),
    item VARCHAR(50),
    complaint VARCHAR(200)
);

CREATE TABLE feedback1(
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user1(userid),
    feedback VARCHAR(200),
    rating INTEGER CHECK(rating BETWEEN 1 AND 5)
);

CREATE TABLE payments1(
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user1(userid),
    order_id INTEGER NOT NULL REFERENCES orders1(order_id),
    amount DECIMAL(10,2),
    status VARCHAR(20)
);

CREATE TABLE refund1(
    refund_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user1(userid),
    order_id INTEGER NOT NULL REFERENCES orders1(order_id),
    amount DECIMAL(10,2),
    status VARCHAR(20)
);

CREATE TABLE status1(
    status_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders1(order_id),
    status VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_logs(
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders1(order_id),
    action_type VARCHAR(30),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data from food_fiesta.sql
INSERT INTO user1(f_name, address, mobile_no, email) VALUES
('kavya','nalgonda',8978811376,'kavya@gmail.com'),
('sanjay','warangal',8919753387,'sanjay@gmail.com'),
('teja','nalgonda',8978823376,'teja@gmail.com'),
('devi','miryalaguda',7036339128,'devi@gmail.com'),
('sunny','hyderabad',8978811276,'sunny@gmail.com'),
('anu','lb nagar',8308811376,'anu@gmail.com'),
('satya','khammam',6308811376,'satya@gmail.com'),
('ramya','khammam',8978811907,'ramya@gmail.com'),
('sanju','nagar kurnool',8979911376,'sanju@gmail.com'),
('harika','kadapa',9978811376,'harika@gmail.com');

INSERT INTO orders1(user_id, item, quantity, price, discount, total_price) VALUES
(1,'chicken biryani',2,200,25,175),
(2,'egg biryani',3,180,15,165),
(3,'paneer biryani',1,220,20,200),
(4,'veg biryani',2,150,15,135),
(5,'mushroom biryani',2,190,20,170),
(6,'pani puri',2,60,5,55),
(7,'badam milk',4,350,50,300),
(8,'dry fruits',1,570,70,500),
(9,'veg meals',2,450,50,400),
(10,'fruit salad',3,530,80,450);

INSERT INTO returns1(user_id, order_id, item, amount) VALUES
(1,1,'chicken biryani',175),
(2,2,'egg biryani',165),
(3,3,'paneer biryani',200),
(4,4,'veg biryani',135),
(5,5,'mushroom biryani',170),
(6,6,'pani puri',55),
(7,7,'badam milk',300),
(8,8,'dry fruits',500),
(9,9,'veg meals',400),
(10,10,'fruit salad',450);

INSERT INTO complaint1(user_id, order_id, item, complaint) VALUES
(1,1,'chicken biryani','food was too spicy'),
(2,2,'egg biryani','received cold food'),
(3,3,'paneer biryani','paneer was not cooked properly'),
(4,4,'veg biryani','quantity was less'),
(5,5,'mushroom biryani','bad smell from food'),
(6,6,'pani puri','packing was damaged'),
(7,7,'badam milk','drink was spilled'),
(8,8,'dry fruits','expired product delivered'),
(9,9,'veg meals','late delivery'),
(10,10,'fruit salad','fruits were not fresh');

INSERT INTO feedback1(user_id, feedback, rating) VALUES
(1,'excellent taste',5),
(2,'very good service',4),
(3,'good quality food',4),
(4,'average experience',3),
(5,'food was not hot',2),
(6,'delivery was quick',5),
(7,'taste was average',3),
(8,'packing was excellent',5),
(9,'price is high',2),
(10,'overall satisfied',4);

INSERT INTO payments1(user_id, order_id, amount, status) VALUES
(1,1,175,'completed'),
(2,2,165,'completed'),
(3,3,200,'returned'),
(4,4,135,'completed'),
(5,5,170,'pending'),
(6,6,55,'completed'),
(7,7,300,'returned'),
(8,8,500,'completed'),
(9,9,400,'pending'),
(10,10,450,'completed');

INSERT INTO refund1(user_id, order_id, amount, status) VALUES
(1,1,175,'completed'),
(2,2,165,'completed'),
(3,3,200,'pending'),
(4,4,135,'completed'),
(5,5,170,'pending'),
(6,6,55,'completed'),
(7,7,300,'pending'),
(8,8,500,'completed'),
(9,9,400,'pending'),
(10,10,450,'completed');

INSERT INTO status1(order_id, status) VALUES
(1,'completed'),
(2,'completed'),
(3,'returned'),
(4,'completed'),
(5,'pending'),
(6,'completed'),
(7,'returned'),
(8,'completed'),
(9,'pending'),
(10,'completed');

INSERT INTO order_logs(order_id, action_type) VALUES
(1,'new order'),
(2,'new order'),
(3,'new order'),
(4,'new order'),
(5,'new order'),
(6,'new order'),
(7,'new order'),
(8,'new order'),
(9,'new order'),
(10,'new order');
''')

conn.commit()
print('SQLite seed database successfully created at:', db_path)
conn.close()
