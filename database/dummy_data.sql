-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: wedding_organizer
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'owner_utama','$2b$10$HUGukUlGnGuUB02L5w7RoeYa6QHo9VABPIX7YDZbxj/2o6sGMKA6C','Budi Santoso','owner','2026-04-09 12:10:16','2026-04-11 04:16:09'),(2,'admin_event1','password','Siti Aminah','admin','2026-04-09 12:10:16','2026-04-09 12:10:16'),(3,'admin_event2','password','Rina Wijaya','admin','2026-04-09 12:10:16','2026-04-09 12:10:16');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'INV/20260408/0001','Andi & Rina','081234567890','2026-06-15','09:00:00','Gedung Serbaguna Depok','Jl. Margonda Raya No. 10, Depok',NULL,2,'confirmed','Tim lapangan standby jam 05:00. Katering minta tambahan pondokan sate.','2026-04-09 12:10:16'),(2,'INV/20260408/0002','Budi & Sari','085678901234','2026-07-20','11:00:00','Hotel Bumi Wiyata','Jl. Margonda Raya No. 281, Depok',NULL,3,'pending','Belum ada catatan khusus, menunggu konfirmasi layout pelaminan.','2026-04-09 12:10:16'),(3,'INV/20260408/0003','Citra & Doni','081122334455','2026-05-10','19:00:00','Rumah Klien','Jl. Sawangan No. 5, Depok',NULL,1,'completed','Acara selesai. Semua aset dekorasi sudah ditarik kembali ke gudang agensi.','2026-04-09 12:10:16'),(4,'INV/20260408/0004','Eko & Maya','089988776655','2026-08-05','08:00:00','Masjid Kubah Emas','Jl. Raya Meruyung, Limo',NULL,2,'confirmed','Akad nikah di masjid, resepsi di aula samping. Koordinasi ketat dengan keamanan setempat.','2026-04-09 12:10:16'),(5,'INV/20260408/0005','Fajar & Gita','082233445566','2026-09-12','10:00:00','Aula UI Depok','Kampus UI, Beji, Depok',NULL,3,'cancelled','Pembatalan oleh klien. Tidak perlu ada distribusi logistik ke lapangan.','2026-04-09 12:10:16');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `guests`
--

LOCK TABLES `guests` WRITE;
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,5000000.00,'2026-04-01','booking_fee','Transfer BCA',NULL,NULL,'pending','2026-04-09 12:10:16','2026-04-13 05:25:56'),(2,1,10000000.00,'2026-04-07','down_payment','Transfer BCA',NULL,NULL,'pending','2026-04-09 12:10:16','2026-04-13 05:25:56');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wedding_packages`
--

LOCK TABLES `wedding_packages` WRITE;
/*!40000 ALTER TABLE `wedding_packages` DISABLE KEYS */;
INSERT INTO `wedding_packages` VALUES (1,'Paket Silver (Econ)',25000000.00,'Katering 300 porsi, Dekorasi pelaminan standar, MUA & Attire, Dokumentasi 1 hari.',1,'2026-04-09 12:10:16'),(2,'Paket Gold (Standard)',50000000.00,'Katering 600 porsi, Dekorasi bunga segar, MUA Premium, Dokumentasi & Video Cinematic.',1,'2026-04-09 12:10:16'),(3,'Paket Platinum (Luxury)',85000000.00,'Katering 1000 porsi, Dekorasi Full-Hall, Live Music, Photo Booth, & Wedding Organizer (5 orang).',1,'2026-04-09 12:10:16');
/*!40000 ALTER TABLE `wedding_packages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13 13:10:17

