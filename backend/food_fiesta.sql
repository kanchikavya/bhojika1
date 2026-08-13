create database food_fiesta;
use food_fiesta;
create table user1(userid int auto_increment primary key,f_name varchar(30) not null,address varchar(50),mobile_no bigint not null,email varchar(50) unique);
create table orders1(order_id int auto_increment primary key,user_id int not null,item varchar(50) not null,quantity int not null,price decimal(10,2) not null,discount decimal(10,2) default 0,total_price decimal(10,2) not null,constraint fk_orders_user foreign key(user_id) references user1(userid));
create table returns1(return_id int auto_increment primary key,user_id int not null,order_id int not null,item varchar(50),amount decimal(10,2),constraint fk_returns_user foreign key(user_id) references user1(userid),constraint fk_returns_order foreign key(order_id) references orders1(order_id));
create table complaint1(complaint_id int auto_increment primary key,user_id int not null,order_id int not null,item varchar(50),complaint varchar(200),constraint fk_complaint_user foreign key(user_id) references user1(userid),constraint fk_complaint_order foreign key(order_id) references orders1(order_id));
create table feedback1(feedback_id int auto_increment primary key, user_id int not null, feedback varchar(200), rating int check(rating between 1 and 5), constraint fk_feedback_user foreign key(user_id) references user1(userid));
create table payments1 (payment_id int auto_increment primary key,user_id int not null,order_id int not null,amount decimal(10,2),status varchar(20),constraint fk_payment_user foreign key(user_id) references user1(userid),constraint fk_payment_order foreign key(order_id) references orders1(order_id));
create table refund1(refund_id int auto_increment primary key,user_id int not null,order_id int not null,amount decimal(10,2), status varchar(20),constraint fk_refund_user foreign key(user_id) references user1(userid),constraint fk_refund_order foreign key(order_id) references orders1(order_id));
create table status1 (status_id int auto_increment primary key, order_id int not null, status varchar(20), updated_at timestamp default current_timestamp, constraint fk_status_order foreign key(order_id) references orders1(order_id));
create table order_logs(log_id int auto_increment primary key,order_id int not null, action_type varchar(30), action_time timestamp default current_timestamp,
 constraint fk_logs_order foreign key(order_id) references orders1(order_id));
show tables;
desc user1;
desc orders1;
desc returns1;
desc complaint1;
desc feedback1;
desc payments1;
desc refund1;
desc status1;
desc order_logs;
use food_fiesta;
delimiter //
create procedure insert_user( in p_name varchar(30),in p_address varchar(50),in p_mobile_no bigint,in p_email varchar(50))
begin
    insert into user1(f_name,address,mobile_no,email) values (p_name,p_address,p_mobile_no,p_email);
end //
call insert_user('kavya','nalgonda',8978811376,'kavya@gmail.com');
call insert_user('sanjay','warangal',8919753387,'sanjay@gmail.com');
call insert_user('teja','nalgonda',8978823376,'teja@gmail.com');
call insert_user('devi','miryalaguda',7036339128,'devi@gmail.com');
call insert_user('sunny','hyderabad',8978811276,'sunny@gmail.com');
call insert_user('anu','lb nagar',8308811376,'anu@gmail.com');
call insert_user('satya','khammam',6308811376,'satya@gmail.com');
call insert_user('ramya','khammam',8978811907,'ramya@gmail.com');
call insert_user('sanju','nagar kurnool',8979911376,'sanju@gmail.com');
call insert_user('harika','kadapa',9978811376,'harika@gmail.com');
select * from user1;
delimiter //
create procedure insert_order( in p_user_id int,in p_item varchar(50),in p_quantity int,in p_price decimal(10,2),in p_discount decimal(10,2),in p_total_price decimal(10,2))
begin
    insert into orders1(user_id,item,quantity,price,discount,total_price) values (p_user_id,p_item,p_quantity,p_price,p_discount,p_total_price);
end //
call insert_order(1,'chicken biryani',2,200,25,175);
call insert_order(2,'egg biryani',3,180,15,165);
call insert_order(3,'paneer biryani',1,220,20,200);
call insert_order(4,'veg biryani',2,150,15,135);
call insert_order(5,'mushroom biryani',2,190,20,170);
call insert_order(6,'pani puri',2,60,5,55);
call insert_order(7,'badam milk',4,350,50,300);
call insert_order(8,'dry fruits',1,570,70,500);
call insert_order(9,'veg meals',2,450,50,400);
call insert_order(10,'fruit salad',3,530,80,450);
select * from orders1;
use food_fiesta;
delimiter //
create procedure insert_return1( in p_user_id int,in p_order_id int,in p_item varchar(50),in p_amount decimal(10,2))
begin
    insert into returns1(user_id,order_id,item,amount) values(p_user_id,p_order_id,p_item,p_amount);
end //
call insert_return1(1,2,'chicken biryani',175);
call insert_return1(2,3,'egg biryani',165);
call insert_return1(3,4,'paneer biryani',200);
call insert_return1(4,5,'veg biryani',135);
call insert_return1(5,6,'mushroom biryani',170);
call insert_return1(6,7,'pani puri',55);
call insert_return1(7,8,'badam milk',300);
call insert_return1(8,9,'dry fruits',500);
call insert_return1(9,10,'veg meals',400);
call insert_return1(10,11,'fruit salad',450);
select * from returns1;
delimiter //
create procedure insert_complaint( in p_user_id int, in p_order_id int, in p_item varchar(50), in p_complaint varchar(200))
begin
    insert into complaint1(user_id,order_id,item,complaint) values(p_user_id,p_order_id,p_item,p_complaint);
end //
call insert_complaint(1,2,'chicken biryani','food was too spicy');
call insert_complaint(2,3,'egg biryani','received cold food');
call insert_complaint(3,4,'paneer biryani','paneer was not cooked properly');
call insert_complaint(4,5,'veg biryani','quantity was less');
call insert_complaint(5,6,'mushroom biryani','bad smell from food');
call insert_complaint(6,7,'pani puri','packing was damaged');
call insert_complaint(7,8,'badam milk','drink was spilled');
call insert_complaint(8,9,'dry fruits','expired product delivered');
call insert_complaint(9,10,'veg meals','late delivery');
call insert_complaint(10,11,'fruit salad','fruits were not fresh');
select * from complaint1;

delimiter //
create procedure insert_feedback( in p_user_id int, in p_feedback varchar(200), in p_rating int)
begin
    insert into feedback1(user_id,feedback,rating) values(p_user_id,p_feedback,p_rating);
end //
call insert_feedback(1,'excellent taste',5);
call insert_feedback(2,'very good service',4);
call insert_feedback(3,'good quality food',4);
call insert_feedback(4,'average experience',3);
call insert_feedback(5,'food was not hot',2);
call insert_feedback(6,'delivery was quick',5);
call insert_feedback(7,'taste was average',3);
call insert_feedback(8,'packing was excellent',5);
call insert_feedback(9,'price is high',2);
call insert_feedback(10,'overall satisfied',4);
select * from feedback1;
use food_fiesta;
delimiter //
create procedure insert_payment( in p_user_id int, in p_order_id int, in p_amount decimal(10,2), in p_status varchar(20))
begin
    insert into payments1(user_id,order_id,amount,status) values(p_user_id,p_order_id,p_amount,p_status);
end //
call insert_payment(1,2,175,'completed');
call insert_payment(2,3,165,'completed');
call insert_payment(3,4,200,'returned');
call insert_payment(4,5,135,'completed');
call insert_payment(5,6,170,'pending');
call insert_payment(6,7,55,'completed');
call insert_payment(7,8,300,'returned');
call insert_payment(8,9,500,'completed');
call insert_payment(9,10,400,'pending');
call insert_payment(10,11,450,'completed');
select * from payments1;
delimiter //
create procedure insert_refund( in p_user_id int,in p_order_id int,in p_amount decimal(10,2),in p_status varchar(20))
begin
    insert into refund1(user_id,order_id,amount,status) values(p_user_id,p_order_id,p_amount,p_status);
end //
call insert_refund(1,2,175,'completed');
call insert_refund(2,3,165,'completed');
call insert_refund(3,4,200,'pending');
call insert_refund(4,5,135,'completed');
call insert_refund(5,6,170,'pending');
call insert_refund(6,7,55,'completed');
call insert_refund(7,8,300,'pending');
call insert_refund(8,9,500,'completed');
call insert_refund(9,10,400,'pending');
call insert_refund(10,11,450,'completed');
select * from refund1;
delimiter //
create procedure insert_status( in p_order_id int,in p_status varchar(20))
begin
    insert into status1(order_id,status) values(p_order_id,p_status);
end //
call insert_status(2,'completed');
call insert_status(3,'completed');
call insert_status(4,'returned');
call insert_status(5,'completed');
call insert_status(6,'pending');
call insert_status(7,'completed');
call insert_status(8,'returned');
call insert_status(9,'completed');
call insert_status(10,'pending');
call insert_status(11,'completed');
select * from status1;
use food_fiesta;
delimiter //
create trigger trg_order_log after insert on orders1 for each row
begin
    insert into order_logs(order_id,action_type) values(new.order_id,'new order');
end //
delimiter //
create trigger trg_order_status after insert on orders1 for each row
begin
    insert into status1(order_id,status) values(new.order_id,'pending');
end //
delimiter //
create trigger trg_return_status after insert on returns1 for each row
begin
    update status1 set status='returned' where order_id=new.order_id;
end //
delimiter //
create trigger trg_refund_payment after insert on refund1 for each row
begin
    update payments1 set status='refunded' where order_id=new.order_id;
end //
use food_fiesta;
select count(*) as total_users from user1;
select count(*) as total_orders from orders1;
select count(*) as total_returns from returns1;
select count(*) as total_payments from payments1;
select count(*) as total_refunds from refund1;
select sum(total_price) as total_revenue from orders1;
select sum(amount) as total_payment from payments1;
select avg(total_price) as average_order_amount from orders1;
select max(total_price) as highest_order_amount from orders1;
select min(total_price) as lowest_order_amount from orders1;
select user_id,sum(total_price) as total_spent from orders1 group by user_id;
select user_id,avg(total_price) as average_spent from orders1 group by user_id;
select user_id,count(order_id) as total_orders from orders1 group by user_id;
select status,count(*) as total_orders from payments1 group by status;
select user_id,sum(total_price) as total_spent from orders1 group by user_id having sum(total_price)>300;
select user_id,max(total_price) as highest_purchase from orders1 group by user_id;
select user_id,min(total_price) as lowest_purchase from orders1 group by user_id;

select u.userid,u.f_name,o.order_id,o.item,o.total_price from user1 u inner join orders1 o on u.userid=o.user_id;
select o.order_id,o.item,o.total_price,r.return_id,r.amount from orders1 o left join returns1 r on o.order_id=r.order_id;
select o.order_id,o.item,o.total_price,p.payment_id,p.status from orders1 o right join payments1 p on o.order_id=p.order_id;
select u.userid,u.f_name,p.payment_id,p.status from user1 u left join payments1 p on u.userid=p.user_id;
select r.return_id,r.item,rf.amount,rf.status from returns1 r inner join refund1 rf on r.order_id=rf.order_id;
select c.complaint_id,c.item,c.complaint,f.feedback,f.rating from complaint1 c inner join feedback1 f on c.user_id=f.user_id;
select u.f_name,o.item,p.status,s.status from user1 u join orders1 o on u.userid=o.user_id join payments1 p on o.order_id=p.order_id join status1 s on o.order_id=s.order_id;
select u.f_name,o.item from user1 u cross join orders1 o;
select * from orders1 where total_price=(select max(total_price) from orders1);
select * from orders1 where total_price>(select avg(total_price) from orders1);
select * from user1 where userid in(select user_id from returns1);
select * from user1 where userid not in(select user_id from returns1);
select * from payments1 where amount>(select avg(amount) from payments1);
select * from refund1 where amount=(select max(amount) from refund1);
select u.f_name from user1 u where exists(select 1 from orders1 o where o.user_id=u.userid);
select * from orders1 where user_id=(select user_id from orders1 order by total_price desc limit 1);
select order_id,user_id,item,total_price,row_number() over(order by total_price desc) as row_num from orders1;
select order_id,item,total_price,rank() over(order by total_price desc) as ranking from orders1;
select order_id,item,total_price,dense_rank() over(order by total_price desc) as dense_ranking from orders1;
select order_id,item,total_price,sum(total_price) over(order by order_id) as running_total from orders1;
select order_id,item,total_price,avg(total_price) over() as average_order from orders1;
select user_id,sum(total_price) as total_spent,dense_rank() over(order by sum(total_price) desc) as customer_rank from orders1 group by user_id;
select order_id,total_price,lag(total_price) over(order by order_id) as previous_order from orders1;
select order_id,total_price,lead(total_price) over(order by order_id) as next_order from orders1;
select user_id,order_id,total_price,row_number() over(partition by user_id order by total_price desc) as row_num from orders1;
select user_id,order_id,total_price,rank() over(partition by user_id order by total_price desc) as ranking from orders1;
select user_id,order_id,total_price,dense_rank() over(partition by user_id order by total_price desc) as dense_ranking from orders1;