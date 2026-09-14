-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: kuelap
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `areas_investigacion`
--

DROP TABLE IF EXISTS `areas_investigacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas_investigacion` (
  `idarea_investigacion` int(11) NOT NULL AUTO_INCREMENT,
  `nom_area_investigacion` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idarea_investigacion`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas_investigacion`
--

LOCK TABLES `areas_investigacion` WRITE;
/*!40000 ALTER TABLE `areas_investigacion` DISABLE KEYS */;
INSERT INTO `areas_investigacion` VALUES (1,'Alimentos',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(2,'Ambiental',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(3,'Biodiversidad',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(4,'Ciencia cognitiva del aprendizaje',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(5,'Ciencias Ambientales, spatial analysis, water resources',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(6,'Ciencias ambientales y microbiología',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(7,'Ciencias biológicas y ambientales',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(8,'Ciencias de la computación',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(9,'Ciencias económicas',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(10,'Ciencias forestales y ambientales',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(11,'Computación de Altas prestaciones IoT - Sistemas Computacionales',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(12,'Contabilidad y Auditoría',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(13,'Contabilidad y Auditoría / Educación',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(14,'Dirección del Centro de Desarrollo de Competencias Investigativas',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(15,'Educación',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(16,'Educación - Ciencias sociales',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(17,'Educación de calidad',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(18,'Educación en salud',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(19,'Educación superior',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(20,'Educación, psicología',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(21,'Gestión de la investigación',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(22,'IA - IoT - sistemas computacionales',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(23,'Ingeniería',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(24,'Ingeniería y Tecnología',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(25,'Ingeniería y tecnología',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(26,'Innovación biotecnológica',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(27,'Protección forestal',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(28,'Salud / educación',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(29,'Salud pública, educación superior, políticas públicas',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13'),(30,'Taxonomía, sistemática y biogeografía',NULL,'2026-09-13 05:13:13','2026-09-13 05:13:13');
/*!40000 ALTER TABLE `areas_investigacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-9f828408f0820044300744e4e6ea258f','i:1;',1789278091),('laravel-cache-9f828408f0820044300744e4e6ea258f:timer','i:1789278091;',1789278091);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargos`
--

DROP TABLE IF EXISTS `cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargos` (
  `idcargos` int(11) NOT NULL AUTO_INCREMENT,
  `nom_cargo` varchar(70) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `orden` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idcargos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargos`
--

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificados`
--

DROP TABLE IF EXISTS `certificados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificados` (
  `idcertificados` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion_certificado` text DEFAULT NULL,
  `numero_certificado` varchar(45) NOT NULL,
  `token_certificado` varchar(45) NOT NULL,
  `cod_verificacion` varchar(45) NOT NULL,
  `archivo_pdf` varchar(255) DEFAULT NULL,
  `fecha_emision` datetime NOT NULL,
  `equipo_miembros_idequipo_miembro` int(11) NOT NULL,
  `estado_certificado_idestado_certificado` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idcertificados`),
  UNIQUE KEY `certificados_cod_verificacion_unique` (`cod_verificacion`),
  UNIQUE KEY `certificados_token_certificado_unique` (`token_certificado`),
  KEY `fk_certificados_equipo_miembros1_idx` (`equipo_miembros_idequipo_miembro`),
  KEY `fk_certificados_estado_certificado1_idx` (`estado_certificado_idestado_certificado`),
  CONSTRAINT `fk_certificados_equipo_miembros1` FOREIGN KEY (`equipo_miembros_idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_certificados_estado_certificado1` FOREIGN KEY (`estado_certificado_idestado_certificado`) REFERENCES `estado_certificado` (`idestado_certificado`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificados`
--

LOCK TABLES `certificados` WRITE;
/*!40000 ALTER TABLE `certificados` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condicion_miembro`
--

DROP TABLE IF EXISTS `condicion_miembro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condicion_miembro` (
  `idcondicion_miembro` int(11) NOT NULL AUTO_INCREMENT,
  `nom_condicion` varchar(70) NOT NULL,
  PRIMARY KEY (`idcondicion_miembro`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condicion_miembro`
--

LOCK TABLES `condicion_miembro` WRITE;
/*!40000 ALTER TABLE `condicion_miembro` DISABLE KEYS */;
INSERT INTO `condicion_miembro` VALUES (1,'Habilitado'),(2,'Inhabilitado');
/*!40000 ALTER TABLE `condicion_miembro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuentas_pago_empresa`
--

DROP TABLE IF EXISTS `cuentas_pago_empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuentas_pago_empresa` (
  `idcuenta_pago` int(11) NOT NULL AUTO_INCREMENT,
  `idempresa_kuelap` int(11) NOT NULL,
  `idmetodos_pago` int(11) NOT NULL,
  `alias` varchar(80) DEFAULT NULL,
  `titular` varchar(150) DEFAULT NULL,
  `banco` varchar(100) DEFAULT NULL,
  `numero_cuenta` varchar(45) DEFAULT NULL,
  `cci` varchar(45) DEFAULT NULL,
  `numero_celular` varchar(12) DEFAULT NULL,
  `qr_image` varchar(250) DEFAULT NULL,
  `correo_paypal` varchar(100) DEFAULT NULL,
  `link_paypal` varchar(255) DEFAULT NULL,
  `moneda` varchar(45) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idcuenta_pago`),
  KEY `fk_cuentas_pago_empresa_empresa_kuelap1_idx` (`idempresa_kuelap`),
  KEY `fk_cuentas_pago_empresa_metodos_pago1_idx` (`idmetodos_pago`),
  CONSTRAINT `fk_cuentas_pago_empresa_empresa_kuelap1` FOREIGN KEY (`idempresa_kuelap`) REFERENCES `empresa_kuelap` (`idempresa_kuelap`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_cuentas_pago_empresa_metodos_pago1` FOREIGN KEY (`idmetodos_pago`) REFERENCES `metodos_pago` (`idmetodos_pago`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuentas_pago_empresa`
--

LOCK TABLES `cuentas_pago_empresa` WRITE;
/*!40000 ALTER TABLE `cuentas_pago_empresa` DISABLE KEYS */;
INSERT INTO `cuentas_pago_empresa` VALUES (3,1,1,'PayPal Red Kuélap','Judith Soledad Yangali Vicente',NULL,NULL,NULL,NULL,NULL,NULL,'https://paypal.me/YangaliVicente','USD',1,'2026-09-13 05:08:50','2026-09-13 05:08:50'),(4,1,2,'Cuenta BCP Red Kuélap','Judith Soledad Yangali Vicente','BCP',NULL,NULL,NULL,NULL,NULL,NULL,'USD',1,'2026-09-13 05:08:50','2026-09-13 05:08:50');
/*!40000 ALTER TABLE `cuentas_pago_empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa_kuelap`
--

DROP TABLE IF EXISTS `empresa_kuelap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa_kuelap` (
  `idempresa_kuelap` int(11) NOT NULL AUTO_INCREMENT,
  `nom_empresa` varchar(150) NOT NULL,
  `emp_descripcion` varchar(45) NOT NULL,
  `emp_logo` varchar(255) NOT NULL,
  `emp_mision` text NOT NULL,
  `emp_vision` text NOT NULL,
  `emp_correo` varchar(80) NOT NULL,
  `emp_telefono` varchar(15) NOT NULL,
  `emp_direccion` varchar(200) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idempresa_kuelap`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa_kuelap`
--

LOCK TABLES `empresa_kuelap` WRITE;
/*!40000 ALTER TABLE `empresa_kuelap` DISABLE KEYS */;
INSERT INTO `empresa_kuelap` VALUES (1,'Red de Investigadores Latinoamericanos KUÉLAP','Red académica latinoamericana','logo-kuelap.png','Pendiente de redactar con el texto oficial de la Red.','Pendiente de redactar con el texto oficial de la Red.','judithsyv@gmail.com','PENDIENTE','Pendiente de completar','2026-09-13 05:02:44','2026-09-13 05:02:44');
/*!40000 ALTER TABLE `empresa_kuelap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa_redes`
--

DROP TABLE IF EXISTS `empresa_redes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa_redes` (
  `idtipos_redes` int(11) NOT NULL,
  `idempresa_kuelap` int(11) NOT NULL,
  `enlace` text NOT NULL,
  PRIMARY KEY (`idtipos_redes`,`idempresa_kuelap`),
  KEY `fk_empresa_redes_tipos_redes1_idx` (`idtipos_redes`),
  KEY `fk_empresa_redes_empresa_kuelap1_idx` (`idempresa_kuelap`),
  CONSTRAINT `fk_empresa_redes_empresa_kuelap1` FOREIGN KEY (`idempresa_kuelap`) REFERENCES `empresa_kuelap` (`idempresa_kuelap`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_empresa_redes_tipos_redes1` FOREIGN KEY (`idtipos_redes`) REFERENCES `tipos_redes` (`idtipos_redes`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa_redes`
--

LOCK TABLES `empresa_redes` WRITE;
/*!40000 ALTER TABLE `empresa_redes` DISABLE KEYS */;
/*!40000 ALTER TABLE `empresa_redes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa_valores`
--

DROP TABLE IF EXISTS `empresa_valores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa_valores` (
  `idempresa_valores` int(11) NOT NULL AUTO_INCREMENT,
  `nom_valores` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `idempresa_kuelap` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idempresa_valores`),
  KEY `fk_empresa_valores_empresa_kuelap1_idx` (`idempresa_kuelap`),
  CONSTRAINT `fk_empresa_valores_empresa_kuelap1` FOREIGN KEY (`idempresa_kuelap`) REFERENCES `empresa_kuelap` (`idempresa_kuelap`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa_valores`
--

LOCK TABLES `empresa_valores` WRITE;
/*!40000 ALTER TABLE `empresa_valores` DISABLE KEYS */;
/*!40000 ALTER TABLE `empresa_valores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo_miembros`
--

DROP TABLE IF EXISTS `equipo_miembros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipo_miembros` (
  `idequipo_miembro` int(11) NOT NULL AUTO_INCREMENT,
  `id_grado_academico` int(11) NOT NULL,
  `idpersonas` int(11) NOT NULL,
  `idcondicion_miembro` int(11) NOT NULL,
  `iduniversidad` int(11) NOT NULL,
  `email_miembro` varchar(80) NOT NULL,
  `cv_archivo` varchar(300) NOT NULL,
  `idtipo_membresia` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idequipo_miembro`),
  UNIQUE KEY `equipo_miembros_email_unique` (`email_miembro`),
  KEY `fk_equipo_miembros_personas1_idx` (`idpersonas`),
  KEY `fk_equipo_miembros_condicion_miembro1_idx` (`idcondicion_miembro`),
  KEY `fk_equipo_miembros_universidades1_idx` (`iduniversidad`),
  KEY `fk_equipo_miembros_grado_academico1_idx` (`id_grado_academico`),
  KEY `fk_equipo_miembros_tipos_membresia1_idx` (`idtipo_membresia`),
  CONSTRAINT `fk_equipo_miembros_condicion_miembro1` FOREIGN KEY (`idcondicion_miembro`) REFERENCES `condicion_miembro` (`idcondicion_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipo_miembros_grado_academico1` FOREIGN KEY (`id_grado_academico`) REFERENCES `grado_academico` (`id_grado_academico`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipo_miembros_personas1` FOREIGN KEY (`idpersonas`) REFERENCES `personas` (`idpersonas`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipo_miembros_tipos_membresia1` FOREIGN KEY (`idtipo_membresia`) REFERENCES `tipos_membresia` (`idtipo_membresia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipo_miembros_universidades1` FOREIGN KEY (`iduniversidad`) REFERENCES `universidades` (`iduniversidad`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo_miembros`
--

LOCK TABLES `equipo_miembros` WRITE;
/*!40000 ALTER TABLE `equipo_miembros` DISABLE KEYS */;
INSERT INTO `equipo_miembros` VALUES (103,1,1,1,12,'Betydiazdiaz@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(104,1,2,1,3,'Pedagogiasmultiproposito2020@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(105,1,3,1,9,'Antonperu3@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(106,1,4,1,4,'Charito_tavara@hotmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(107,1,5,1,26,'clami26@yahoo.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(108,2,6,1,14,'lizbejarano@unat.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(109,1,7,1,18,'eaguirre@uns.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(110,1,8,1,22,'Flor.garcia@untrm.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(111,1,9,1,2,'Gemoramar@hotmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(112,1,10,1,15,'Hiberhuaylla@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(113,1,11,1,5,'Sandoval@uabcs.mx','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(114,1,12,1,24,'jcharcaper@unp.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(115,1,13,1,20,'judithsyv@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(116,1,14,1,21,'Lcarbajalg@hotmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(117,1,15,1,21,'Lrpq72@hotmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(118,1,16,1,19,'Ltorres@unajma.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(119,1,17,1,6,'Reddeinvestigacion@autonoma.edu.co','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(120,1,18,1,13,'Mmanta@lamolina.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(121,1,19,1,16,'sarmig@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(122,1,20,1,17,'Gywanaga@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(123,1,21,1,7,'salomo@uaem.mx','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(124,1,22,1,15,'Ollallac@unam.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(125,1,23,1,20,'riveraolozada@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(126,1,24,1,10,'Patricia.maldonado@umag.cl','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(127,1,25,1,10,'Pedro.alberti@umag.cl','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(128,1,26,1,1,'Pierre.zaya@gadz.org','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(129,1,27,1,23,'svergaram@unj.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(130,1,28,1,9,'sparedes@ucv.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(131,1,29,1,11,'Favimogro_@hotmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(132,1,30,1,25,'delsihuaita@gmail.com','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(133,1,31,1,8,'jordonezp@ucacue.edu.ec','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(134,1,32,1,8,'gramon@ucacue.edu.ec','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(135,1,33,1,8,'cjaramillo@ucacue.edu.ec','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28'),(136,1,34,1,9,'maribel24@ucvvirtual.edu.pe','pendiente_subir.pdf',1,'2026-09-13 00:33:28','2026-09-13 05:33:28','2026-09-13 05:33:28');
/*!40000 ALTER TABLE `equipo_miembros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo_miembros_lineas_investigacion`
--

DROP TABLE IF EXISTS `equipo_miembros_lineas_investigacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipo_miembros_lineas_investigacion` (
  `idequipo_miembro` int(11) NOT NULL,
  `idlinea_investigacion` int(11) NOT NULL,
  PRIMARY KEY (`idequipo_miembro`,`idlinea_investigacion`),
  KEY `fk_equipo_miembros_has_lineas_investigacion_lineas_investig_idx` (`idlinea_investigacion`),
  KEY `fk_equipo_miembros_has_lineas_investigacion_equipo_miembros_idx` (`idequipo_miembro`),
  CONSTRAINT `fk_equipo_miembros_has_lineas_investigacion_equipo_miembros1` FOREIGN KEY (`idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipo_miembros_has_lineas_investigacion_lineas_investigac1` FOREIGN KEY (`idlinea_investigacion`) REFERENCES `lineas_investigacion` (`idlinea_investigacion`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo_miembros_lineas_investigacion`
--

LOCK TABLES `equipo_miembros_lineas_investigacion` WRITE;
/*!40000 ALTER TABLE `equipo_miembros_lineas_investigacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipo_miembros_lineas_investigacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_certificado`
--

DROP TABLE IF EXISTS `estado_certificado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_certificado` (
  `idestado_certificado` int(11) NOT NULL AUTO_INCREMENT,
  `estado_certificado` varchar(70) NOT NULL,
  PRIMARY KEY (`idestado_certificado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_certificado`
--

LOCK TABLES `estado_certificado` WRITE;
/*!40000 ALTER TABLE `estado_certificado` DISABLE KEYS */;
/*!40000 ALTER TABLE `estado_certificado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_evento`
--

DROP TABLE IF EXISTS `estado_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_evento` (
  `idestado_event` int(11) NOT NULL AUTO_INCREMENT,
  `nom_estado_event` varchar(70) NOT NULL,
  PRIMARY KEY (`idestado_event`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_evento`
--

LOCK TABLES `estado_evento` WRITE;
/*!40000 ALTER TABLE `estado_evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `estado_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_mensaje`
--

DROP TABLE IF EXISTS `estado_mensaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_mensaje` (
  `idestado_mensaje` int(11) NOT NULL AUTO_INCREMENT,
  `nom_estado_mensaje` varchar(70) NOT NULL,
  PRIMARY KEY (`idestado_mensaje`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_mensaje`
--

LOCK TABLES `estado_mensaje` WRITE;
/*!40000 ALTER TABLE `estado_mensaje` DISABLE KEYS */;
INSERT INTO `estado_mensaje` VALUES (1,'Nuevo'),(2,'Leido'),(3,'Respondido'),(4,'Archivado'),(5,'Spam');
/*!40000 ALTER TABLE `estado_mensaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_pago`
--

DROP TABLE IF EXISTS `estado_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_pago` (
  `idestado_pago` int(11) NOT NULL AUTO_INCREMENT,
  `nom_estado_pago` varchar(100) NOT NULL,
  PRIMARY KEY (`idestado_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_pago`
--

LOCK TABLES `estado_pago` WRITE;
/*!40000 ALTER TABLE `estado_pago` DISABLE KEYS */;
INSERT INTO `estado_pago` VALUES (1,'Pendiente de validacion'),(2,'Validado'),(3,'Rechazado'),(4,'Vencido');
/*!40000 ALTER TABLE `estado_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_publicacion`
--

DROP TABLE IF EXISTS `estado_publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_publicacion` (
  `idestado_publicacion` int(11) NOT NULL AUTO_INCREMENT,
  `nom_estado_publicacion` varchar(100) NOT NULL,
  PRIMARY KEY (`idestado_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_publicacion`
--

LOCK TABLES `estado_publicacion` WRITE;
/*!40000 ALTER TABLE `estado_publicacion` DISABLE KEYS */;
INSERT INTO `estado_publicacion` VALUES (1,'Borrador'),(2,'Publicado'),(3,'Archivado');
/*!40000 ALTER TABLE `estado_publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_solicitud`
--

DROP TABLE IF EXISTS `estado_solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_solicitud` (
  `idestado_solicitud` int(11) NOT NULL AUTO_INCREMENT,
  `nom_estado_solicitud` varchar(60) NOT NULL,
  PRIMARY KEY (`idestado_solicitud`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_solicitud`
--

LOCK TABLES `estado_solicitud` WRITE;
/*!40000 ALTER TABLE `estado_solicitud` DISABLE KEYS */;
INSERT INTO `estado_solicitud` VALUES (1,'Pendiente'),(2,'En revision'),(3,'Pre-aprobada'),(4,'Rechazada'),(5,'Aprobada');
/*!40000 ALTER TABLE `estado_solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `idevento` int(11) NOT NULL AUTO_INCREMENT,
  `nom_evento` text NOT NULL,
  `descripcion` text NOT NULL,
  `idestado_event` int(11) NOT NULL,
  `idmodalidad` int(11) NOT NULL,
  `idtipo_evento` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `fec_inicio_inscripcion` date NOT NULL,
  `fec_fin_inscripcion` date NOT NULL,
  `espacio_lugar` text DEFAULT NULL,
  `link_form_inscripcion` text DEFAULT NULL,
  'image_evento' VARCHAR(255) NOT null,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idevento`),
  KEY `fk_evento_estado_evento1_idx` (`idestado_event`),
  KEY `fk_evento_modalidad1_idx` (`idmodalidad`),
  KEY `fk_evento_tipos_evento1_idx` (`idtipo_evento`),
  CONSTRAINT `fk_evento_estado_evento1` FOREIGN KEY (`idestado_event`) REFERENCES `estado_evento` (`idestado_event`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_evento_modalidad1` FOREIGN KEY (`idmodalidad`) REFERENCES `modalidad` (`idmodalidad`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_evento_tipos_evento1` FOREIGN KEY (`idtipo_evento`) REFERENCES `tipos_evento` (`idtipo_evento`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento_plataforma`
--

DROP TABLE IF EXISTS `evento_plataforma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_plataforma` (
  `idevent_canal` int(11) NOT NULL AUTO_INCREMENT,
  `idplataforma` int(11) NOT NULL,
  `idevento` int(11) NOT NULL,
  `link_transmision` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idevent_canal`),
  KEY `fk_evento_plataforma_plataformas1_idx` (`idplataforma`),
  KEY `fk_evento_plataforma_evento1_idx` (`idevento`),
  CONSTRAINT `fk_evento_plataforma_evento1` FOREIGN KEY (`idevento`) REFERENCES `evento` (`idevento`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_evento_plataforma_plataformas1` FOREIGN KEY (`idplataforma`) REFERENCES `plataformas` (`idplataforma`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_plataforma`
--

LOCK TABLES `evento_plataforma` WRITE;
/*!40000 ALTER TABLE `evento_plataforma` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento_plataforma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento_ponentes`
--

DROP TABLE IF EXISTS `evento_ponentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_ponentes` (
  `idevento_ponente` int(11) NOT NULL AUTO_INCREMENT,
  `evento_idevento` int(11) NOT NULL,
  `equipo_miembros_idequipo_miembro` int(11) NOT NULL,
  `tema_ponencia` varchar(300) DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idevento_ponente`),
  KEY `fk_evento_ponentes_evento1_idx` (`evento_idevento`),
  KEY `fk_evento_ponentes_equipo_miembros1_idx` (`equipo_miembros_idequipo_miembro`),
  CONSTRAINT `fk_evento_ponentes_equipo_miembros1` FOREIGN KEY (`equipo_miembros_idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_evento_ponentes_evento1` FOREIGN KEY (`evento_idevento`) REFERENCES `evento` (`idevento`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_ponentes`
--

LOCK TABLES `evento_ponentes` WRITE;
/*!40000 ALTER TABLE `evento_ponentes` DISABLE KEYS */;
/*!40000 ALTER TABLE `evento_ponentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genero`
--

DROP TABLE IF EXISTS `genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genero` (
  `idgenero` int(11) NOT NULL AUTO_INCREMENT,
  `nom_genero` varchar(45) NOT NULL,
  PRIMARY KEY (`idgenero`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genero`
--

LOCK TABLES `genero` WRITE;
/*!40000 ALTER TABLE `genero` DISABLE KEYS */;
INSERT INTO `genero` VALUES (1,'Masculino'),(2,'Femenino');
/*!40000 ALTER TABLE `genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grado_academico`
--

DROP TABLE IF EXISTS `grado_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grado_academico` (
  `id_grado_academico` int(11) NOT NULL AUTO_INCREMENT,
  `abreviatura` varchar(15) NOT NULL,
  `nombre_titulo` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`id_grado_academico`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado_academico`
--

LOCK TABLES `grado_academico` WRITE;
/*!40000 ALTER TABLE `grado_academico` DISABLE KEYS */;
INSERT INTO `grado_academico` VALUES (1,'N/E','No especificado'),(2,'Dra.','Doctora');
/*!40000 ALTER TABLE `grado_academico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lineas_investigacion`
--

DROP TABLE IF EXISTS `lineas_investigacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lineas_investigacion` (
  `idlinea_investigacion` int(11) NOT NULL AUTO_INCREMENT,
  `linea_investigacion` varchar(250) NOT NULL,
  `idarea_investigacion` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idlinea_investigacion`),
  KEY `fk_lineas_investigacion_areas_investigacion1_idx` (`idarea_investigacion`),
  CONSTRAINT `fk_lineas_investigacion_areas_investigacion1` FOREIGN KEY (`idarea_investigacion`) REFERENCES `areas_investigacion` (`idarea_investigacion`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lineas_investigacion`
--

LOCK TABLES `lineas_investigacion` WRITE;
/*!40000 ALTER TABLE `lineas_investigacion` DISABLE KEYS */;
INSERT INTO `lineas_investigacion` VALUES (1,'Autorregulación del aprendizaje, comportamiento, praxis docente',20,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(2,'Estilos de aprendizaje',15,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(3,'Educación/Ciencias sociales/Gestión pública',16,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(4,'Educación inclusiva y atención a la diversidad',15,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(5,'Salud pública / educación',28,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(6,'Innovación alimentaria',24,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(7,'Alimentos funcionales',1,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(8,'Biodiversidad',7,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(9,'Nuevas aproximaciones en la evaluación cognitivo-emocional del aprendizaje y la enseñanza presencial y digital',4,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(10,'Ciencia de la botánica, manejo y conservación de recursos vegetales',30,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(11,'Tecnología inclusiva y accesible, tratamiento de la información',8,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(12,'Botánica, Biogeografía, Ecología',3,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(13,'Responsabilidad social e innovación, educación superior, innovación',19,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(14,'Contabilidad/finanzas/auditoría/costos/gestión pública/gestión pública por resultados',9,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(15,'Caracterización, desarrollo de procesos e innovación en la agroindustria',25,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(16,'Calidad del agua, microbiología de alimentos',6,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(17,'Gestión de ctei, calidad de la educación superior',29,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(18,'Conservación de los recursos forestales',27,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(19,'Servicios ambientales - economía forestal y ambiental - Bioeconomía forestal y economía circular',10,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(20,'Contaminación/oceanografía/biodiversidad',2,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(21,'Innovaciones pedagógicas, experiencias alternativas y nuevas tecnologías/Educación Internacional y Nuevas Tecnologías',19,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(22,'Bioprospección para el aprovechamiento sostenible de la biodiversidad vegetal',26,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(23,'Salud pública, epidemiología, educación en salud, educación superior',18,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(24,'IoT, Inteligencia Artificial',22,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(25,'Computación paralela, IoT, rehabilitación',11,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(26,'Gestión de la investigación',21,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(27,'Spatial modelling, Modelización Ambiental, Gestión de la Calidad Ambiental',5,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(28,'Violencia - salud sexual y reproductiva, enfermedades infecciosas y transmisibles, gestión de la investigación',14,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(29,'Ciencias naturales e ingeniería',23,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(30,'Atención integral del infante, niño y adolescente. Educación superior',17,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(31,'Banca y finanzas, auditoría, control interno, proyectos de investigación enfocados a diferentes sectores a fin de apoyar con estrategias de mejora en el ámbito contable, financiero y de control',12,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(32,'Contabilidad, Finanzas, Control Interno, Gestión empresarial, capital Intelectual, Instituciones de Educación Superior',13,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(33,'Contabilidad, Finanzas, Gestión Empresarial',12,'2026-09-13 05:14:06','2026-09-13 05:14:06'),(34,'Salud sexual, reproductiva y violencia/educación superior',28,'2026-09-13 05:14:06','2026-09-13 05:14:06');
/*!40000 ALTER TABLE `lineas_investigacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logros_miembros`
--

DROP TABLE IF EXISTS `logros_miembros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logros_miembros` (
  `idlogros_miembros` int(11) NOT NULL AUTO_INCREMENT,
  `idequipo_miembro` int(11) NOT NULL,
  `idtipos_logro` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_logro` date NOT NULL,
  `archivo_evidencia` varchar(300) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idlogros_miembros`),
  KEY `fk_logros_miembros_equipo_miembros1_idx` (`idequipo_miembro`),
  KEY `fk_logros_miembros_tipos_logro1_idx` (`idtipos_logro`),
  CONSTRAINT `fk_logros_miembros_equipo_miembros1` FOREIGN KEY (`idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_logros_miembros_tipos_logro1` FOREIGN KEY (`idtipos_logro`) REFERENCES `tipos_logro` (`idtipos_logro`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logros_miembros`
--

LOCK TABLES `logros_miembros` WRITE;
/*!40000 ALTER TABLE `logros_miembros` DISABLE KEYS */;
/*!40000 ALTER TABLE `logros_miembros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes_contacto`
--

DROP TABLE IF EXISTS `mensajes_contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes_contacto` (
  `idmensaje_contacto` int(11) NOT NULL AUTO_INCREMENT,
  `idempresa_kuelap` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo` varchar(75) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `asunto` varchar(200) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` datetime NOT NULL DEFAULT current_timestamp(),
  `direccion_ip` varchar(45) DEFAULT NULL,
  `idestado_mensaje` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idmensaje_contacto`),
  KEY `fk_mensajes_contacto_empresa_kuelap1_idx` (`idempresa_kuelap`),
  KEY `fk_mensajes_contacto_estado_mensaje1_idx` (`idestado_mensaje`),
  CONSTRAINT `fk_mensajes_contacto_empresa_kuelap1` FOREIGN KEY (`idempresa_kuelap`) REFERENCES `empresa_kuelap` (`idempresa_kuelap`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensajes_contacto_estado_mensaje1` FOREIGN KEY (`idestado_mensaje`) REFERENCES `estado_mensaje` (`idestado_mensaje`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes_contacto`
--

LOCK TABLES `mensajes_contacto` WRITE;
/*!40000 ALTER TABLE `mensajes_contacto` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensajes_contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodos_pago`
--

DROP TABLE IF EXISTS `metodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodos_pago` (
  `idmetodos_pago` int(11) NOT NULL AUTO_INCREMENT,
  `nom_metodo_pago` varchar(70) NOT NULL,
  PRIMARY KEY (`idmetodos_pago`),
  UNIQUE KEY `nom_metodo_pago` (`nom_metodo_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
INSERT INTO `metodos_pago` VALUES (1,'PayPal'),(3,'Plin'),(2,'Transferencia bancaria'),(4,'Yape');
/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modalidad`
--

DROP TABLE IF EXISTS `modalidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modalidad` (
  `idmodalidad` int(11) NOT NULL AUTO_INCREMENT,
  `nom_modalidad` varchar(45) NOT NULL,
  PRIMARY KEY (`idmodalidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modalidad`
--

LOCK TABLES `modalidad` WRITE;
/*!40000 ALTER TABLE `modalidad` DISABLE KEYS */;
/*!40000 ALTER TABLE `modalidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticias` (
  `idnoticias` int(11) NOT NULL AUTO_INCREMENT,
  `idempresa_kuelap` int(11) NOT NULL,
  `idequipo_miembro` int(11) DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `resumen` varchar(300) NOT NULL,
  `contenido` text NOT NULL,
  `image_portada` varchar(300) NOT NULL,
  `idestado_publicacion` int(11) NOT NULL,
  `fecha_publicacion` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idnoticias`),
  KEY `fk_noticias_empresa_kuelap1_idx` (`idempresa_kuelap`),
  KEY `fk_noticias_equipo_miembros1_idx` (`idequipo_miembro`),
  KEY `fk_noticias_estado_publicacion1_idx` (`idestado_publicacion`),
  CONSTRAINT `fk_noticias_empresa_kuelap1` FOREIGN KEY (`idempresa_kuelap`) REFERENCES `empresa_kuelap` (`idempresa_kuelap`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noticias_equipo_miembros1` FOREIGN KEY (`idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_noticias_estado_publicacion1` FOREIGN KEY (`idestado_publicacion`) REFERENCES `estado_publicacion` (`idestado_publicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos_membresia`
--

DROP TABLE IF EXISTS `pagos_membresia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos_membresia` (
  `idpago` int(11) NOT NULL AUTO_INCREMENT,
  `idequipo_miembro` int(11) DEFAULT NULL,
  `idsolicitud` int(11) DEFAULT NULL,
  `tipos_membresia_idtipo_membresia` int(11) NOT NULL,
  `cuentas_pago_empresa_idcuenta_pago` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `comprobante_archivo` varchar(300) NOT NULL,
  `idestado_pago` int(11) NOT NULL,
  `validado_por` bigint(20) unsigned DEFAULT NULL,
  `fecha_validacion` datetime DEFAULT NULL,
  `observaciones` varchar(300) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idpago`),
  KEY `fk_pagos_membresia_equipo_miembros1_idx` (`idequipo_miembro`),
  KEY `fk_pagos_membresia_solicitudes_membresia1_idx` (`idsolicitud`),
  KEY `fk_pagos_membresia_tipos_membresia1_idx` (`tipos_membresia_idtipo_membresia`),
  KEY `fk_pagos_membresia_cuentas_pago_empresa1_idx` (`cuentas_pago_empresa_idcuenta_pago`),
  KEY `fk_pagos_membresia_estado_pago1_idx` (`idestado_pago`),
  KEY `fk_pagos_membresia_users1_idx` (`validado_por`),
  CONSTRAINT `fk_pagos_membresia_cuentas_pago_empresa1` FOREIGN KEY (`cuentas_pago_empresa_idcuenta_pago`) REFERENCES `cuentas_pago_empresa` (`idcuenta_pago`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pagos_membresia_equipo_miembros1` FOREIGN KEY (`idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pagos_membresia_estado_pago1` FOREIGN KEY (`idestado_pago`) REFERENCES `estado_pago` (`idestado_pago`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pagos_membresia_solicitudes_membresia1` FOREIGN KEY (`idsolicitud`) REFERENCES `solicitudes_membresia` (`idsolicitud`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pagos_membresia_tipos_membresia1` FOREIGN KEY (`tipos_membresia_idtipo_membresia`) REFERENCES `tipos_membresia` (`idtipo_membresia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pagos_membresia_users1` FOREIGN KEY (`validado_por`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos_membresia`
--

LOCK TABLES `pagos_membresia` WRITE;
/*!40000 ALTER TABLE `pagos_membresia` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos_membresia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pais`
--

DROP TABLE IF EXISTS `pais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pais` (
  `idpais` int(11) NOT NULL AUTO_INCREMENT,
  `nom_pais` varchar(45) NOT NULL,
  PRIMARY KEY (`idpais`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pais`
--

LOCK TABLES `pais` WRITE;
/*!40000 ALTER TABLE `pais` DISABLE KEYS */;
INSERT INTO `pais` VALUES (1,'Argentina'),(2,'Bolivia'),(3,'Canadá'),(4,'Chile'),(5,'Colombia'),(6,'Ecuador'),(7,'México'),(8,'Perú'),(9,'Uruguay');
/*!40000 ALTER TABLE `pais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passkeys`
--

DROP TABLE IF EXISTS `passkeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passkeys` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `credential_id` varchar(255) NOT NULL,
  `credential` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `passkeys_credential_id_unique` (`credential_id`),
  KEY `passkeys_user_id_index` (`user_id`),
  CONSTRAINT `passkeys_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passkeys`
--

LOCK TABLES `passkeys` WRITE;
/*!40000 ALTER TABLE `passkeys` DISABLE KEYS */;
/*!40000 ALTER TABLE `passkeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periodo_miembro_cargo`
--

DROP TABLE IF EXISTS `periodo_miembro_cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodo_miembro_cargo` (
  `idperiodo_miembro` int(11) NOT NULL AUTO_INCREMENT,
  `idperiodos` int(11) NOT NULL,
  `idequipo_miembro` int(11) NOT NULL,
  `idcargos` int(11) NOT NULL,
  `foto_equipo` varchar(300) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idperiodo_miembro`),
  UNIQUE KEY `periodo_cargo_miembro_UNIQUE` (`idperiodos`,`idcargos`,`idequipo_miembro`),
  KEY `fk_periodo_miembro_cargo_periodos1_idx` (`idperiodos`),
  KEY `fk_periodo_miembro_cargo_equipo_miembros1_idx` (`idequipo_miembro`),
  KEY `fk_periodo_miembro_cargo_cargos1_idx` (`idcargos`),
  CONSTRAINT `fk_periodo_miembro_cargo_cargos1` FOREIGN KEY (`idcargos`) REFERENCES `cargos` (`idcargos`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_periodo_miembro_cargo_equipo_miembros1` FOREIGN KEY (`idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_periodo_miembro_cargo_periodos1` FOREIGN KEY (`idperiodos`) REFERENCES `periodos` (`idperiodos`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodo_miembro_cargo`
--

LOCK TABLES `periodo_miembro_cargo` WRITE;
/*!40000 ALTER TABLE `periodo_miembro_cargo` DISABLE KEYS */;
/*!40000 ALTER TABLE `periodo_miembro_cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periodos`
--

DROP TABLE IF EXISTS `periodos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodos` (
  `idperiodos` int(11) NOT NULL AUTO_INCREMENT,
  `nom_periodo` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `es_activo` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idperiodos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodos`
--

LOCK TABLES `periodos` WRITE;
/*!40000 ALTER TABLE `periodos` DISABLE KEYS */;
/*!40000 ALTER TABLE `periodos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `idpermisos` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(70) DEFAULT NULL,
  `nom_permiso` varchar(45) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idpermisos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personas`
--

DROP TABLE IF EXISTS `personas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personas` (
  `idpersonas` int(11) NOT NULL AUTO_INCREMENT,
  `dni` varchar(20) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apell_paterno` varchar(70) NOT NULL,
  `apell_materno` varchar(70) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` text DEFAULT NULL,
  `idgenero` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idpersonas`),
  KEY `fk_personas_genero1_idx` (`idgenero`),
  CONSTRAINT `fk_personas_genero1` FOREIGN KEY (`idgenero`) REFERENCES `genero` (`idgenero`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personas`
--

LOCK TABLES `personas` WRITE;
/*!40000 ALTER TABLE `personas` DISABLE KEYS */;
INSERT INTO `personas` VALUES (1,'PENDIENTE','Bety','Díaz','Subieta','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(2,'PENDIENTE','Carlos','Estigarribia','N/A','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(3,'PENDIENTE','Carlos Alberto','Cherre','Antón','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(4,'PENDIENTE','Charito','Távara','N/A','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(5,'PENDIENTE','Claudia Milagros','Arispe','Alburqueque','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(6,'PENDIENTE','Dagnith Liz','Bejarano','Lujan','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(7,'PENDIENTE','Elza Berta','Aguirre','Vargas','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(8,'PENDIENTE','Flor Teresa','García','Huamán','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(9,'PENDIENTE','Guadalupe Elizabeth','Morales','Martínez','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(10,'PENDIENTE','Mario Hibert','Huaylla','Limachi','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(11,'PENDIENTE','Jesús Andrés','Sandoval','Bringas','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(12,'PENDIENTE','Jesús Manuel','Charcape','Ravelo','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(13,'PENDIENTE','Judith Soledad','Yangali','Vicente','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(14,'PENDIENTE','Luis Omar','Carbajal','García','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(15,'PENDIENTE','Luis Ricardo','Paredes','Quiroz','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(16,'PENDIENTE','Luz Azucena','Torres','García','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(17,'PENDIENTE','María Del Carmen','Vergara','Quintero','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(18,'PENDIENTE','María Isabel','Manta','Nolasco','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(19,'PENDIENTE','Miguel','Sarmiento','N/A','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(20,'PENDIENTE','Nelson Gustavo','Ywanaga','Reh','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(21,'PENDIENTE','Norma Angélica','Juárez','Salomo','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(22,'PENDIENTE','Olimpia','Llalla','Cordova','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(23,'PENDIENTE','Oriana','Rivera Lozada','De Bonilla','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(24,'PENDIENTE','Patricia Verónica','Maldonado','Cárdenas','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(25,'PENDIENTE','Pedro Enrique','Alberti','Villalobos','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(26,'PENDIENTE','Pierre','Zaya','N/A','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(27,'PENDIENTE','Segundo Edilberto','Vergara','Medrano','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(28,'PENDIENTE','Susana Edita','Paredes','Diaz','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(29,'PENDIENTE','Fabiana','Mogro','Colque','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(30,'PENDIENTE','Delsi Mariela','Huaita','Acha','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(31,'PENDIENTE','Yanice Licenia','Ordoñez','Parra','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(32,'PENDIENTE','Glenda Maricela','Ramón','Poma','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(33,'PENDIENTE','Carmen Yolanda','Jaramillo','Calle','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14'),(34,'PENDIENTE','Maribel','Díaz','Espinoza','PENDIENTE',NULL,1,'2026-09-13 05:10:14','2026-09-13 05:10:14');
/*!40000 ALTER TABLE `personas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plataformas`
--

DROP TABLE IF EXISTS `plataformas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plataformas` (
  `idplataforma` int(11) NOT NULL AUTO_INCREMENT,
  `nom_plataforma` varchar(70) NOT NULL,
  PRIMARY KEY (`idplataforma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plataformas`
--

LOCK TABLES `plataformas` WRITE;
/*!40000 ALTER TABLE `plataformas` DISABLE KEYS */;
/*!40000 ALTER TABLE `plataformas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `popups`
--

DROP TABLE IF EXISTS `popups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `popups` (
  `idanuncio` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `imagen_url` varchar(300) NOT NULL,
  `enlace_destino` varchar(255) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `idempresa_kuelap` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idanuncio`),
  KEY `fk_popups_empresa_kuelap1_idx` (`idempresa_kuelap`),
  CONSTRAINT `fk_popups_empresa_kuelap1` FOREIGN KEY (`idempresa_kuelap`) REFERENCES `empresa_kuelap` (`idempresa_kuelap`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `popups`
--

LOCK TABLES `popups` WRITE;
/*!40000 ALTER TABLE `popups` DISABLE KEYS */;
/*!40000 ALTER TABLE `popups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prioridad_pago`
--

DROP TABLE IF EXISTS `prioridad_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prioridad_pago` (
  `idprioridad_pago` int(11) NOT NULL AUTO_INCREMENT,
  `nom_prioridad` varchar(45) NOT NULL,
  `meses_equivalentes` int(11) NOT NULL,
  PRIMARY KEY (`idprioridad_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prioridad_pago`
--

LOCK TABLES `prioridad_pago` WRITE;
/*!40000 ALTER TABLE `prioridad_pago` DISABLE KEYS */;
INSERT INTO `prioridad_pago` VALUES (1,'Mensual',1),(2,'Trimestral',3),(3,'Semestral',6),(4,'Anual',12);
/*!40000 ALTER TABLE `prioridad_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicaciones`
--

DROP TABLE IF EXISTS `publicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicaciones` (
  `idpublicacion` int(11) NOT NULL AUTO_INCREMENT,
  `idequipo_miembro` int(11) DEFAULT NULL,
  `idtipo_publicacion` int(11) NOT NULL,
  `idestado_publicacion` int(11) NOT NULL,
  `titulo` varchar(250) NOT NULL,
  `resumen` text DEFAULT NULL,
  `archivo_pdf` varchar(300) DEFAULT NULL,
  `enlace_externo` varchar(255) DEFAULT NULL,
  `fecha_publicacion` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idpublicacion`),
  KEY `fk_publicaciones_equipo_miembros1_idx` (`idequipo_miembro`),
  KEY `fk_publicaciones_tipos_publicacion1_idx` (`idtipo_publicacion`),
  KEY `fk_publicaciones_estado_publicacion1_idx` (`idestado_publicacion`),
  CONSTRAINT `fk_publicaciones_equipo_miembros1` FOREIGN KEY (`idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_publicaciones_estado_publicacion1` FOREIGN KEY (`idestado_publicacion`) REFERENCES `estado_publicacion` (`idestado_publicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_publicaciones_tipos_publicacion1` FOREIGN KEY (`idtipo_publicacion`) REFERENCES `tipos_publicacion` (`idtipo_publicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicaciones`
--

LOCK TABLES `publicaciones` WRITE;
/*!40000 ALTER TABLE `publicaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `publicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `idroles` int(11) NOT NULL AUTO_INCREMENT,
  `nom_rol` varchar(50) NOT NULL,
  `descripcion_rol` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idroles`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','Control total del panel: miembros, solicitudes, contenido y configuracion del sitio','2026-09-13 05:03:29','2026-09-13 05:03:29'),(2,'Miembro','Acceso a su perfil publico y, si se habilita, a su panel para proponer noticias','2026-09-13 05:03:29','2026-09-13 05:03:29');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_permisos`
--

DROP TABLE IF EXISTS `roles_permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_permisos` (
  `idroles` int(11) NOT NULL,
  `idpermisos` int(11) NOT NULL,
  PRIMARY KEY (`idroles`,`idpermisos`),
  KEY `fk_roles_has_permisos_permisos1_idx` (`idpermisos`),
  KEY `fk_roles_has_permisos_roles1_idx` (`idroles`),
  CONSTRAINT `fk_roles_has_permisos_permisos1` FOREIGN KEY (`idpermisos`) REFERENCES `permisos` (`idpermisos`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_roles_has_permisos_roles1` FOREIGN KEY (`idroles`) REFERENCES `roles` (`idroles`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_permisos`
--

LOCK TABLES `roles_permisos` WRITE;
/*!40000 ALTER TABLE `roles_permisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles_permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('t0Tc0umkJtGVkiL3W1vHjiNpLeMfikvvhrz9flwu',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ4WmtmNkRpSkt5WG4xTGplOWJtNWRXazdVYW05Tnh5OFROUDhRZVo5IiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvc3lzdGVta3VlbGFwLnRlc3RcL2Rhc2hib2FyZCJ9LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvc3lzdGVta3VlbGFwLnRlc3RcL2xvZ2luIiwicm91dGUiOiJsb2dpbiJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1789278101),('UyKIFhcjvJ3buJp8KOEJX0X9SlTbVUb15lQCnR1B',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Herd/1.30.0 Chrome/120.0.6099.291 Electron/28.2.5 Safari/537.36','eyJfdG9rZW4iOiJXYmU3SkMwR2NHRUpnYTJuZUcyODhNYUJVam10aE80blZBT3k5a1V1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3N5c3RlbWt1ZWxhcC50ZXN0XC8/aGVyZD1wcmV2aWV3Iiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1789277730);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_membresia`
--

DROP TABLE IF EXISTS `solicitudes_membresia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_membresia` (
  `idsolicitud` int(11) NOT NULL AUTO_INCREMENT,
  `id_grado_academico` int(11) NOT NULL,
  `idpersonas` int(11) NOT NULL,
  `idtipo_membresia` int(11) NOT NULL,
  `iduniversidad` int(11) NOT NULL,
  `cv_archivo` varchar(300) NOT NULL,
  `motivo_solicitud` text DEFAULT NULL,
  `fecha_solicitud` datetime NOT NULL DEFAULT current_timestamp(),
  `idestado_solicitud` int(11) NOT NULL,
  `comentario_revision` varchar(300) DEFAULT NULL,
  `revisado_por` bigint(20) unsigned DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `idequipo_miembro` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idsolicitud`),
  KEY `fk_solicitudes_membresia_personas1_idx` (`idpersonas`),
  KEY `fk_solicitudes_membresia_grado_academico1_idx` (`id_grado_academico`),
  KEY `fk_solicitudes_membresia_tipos_membresia1_idx` (`idtipo_membresia`),
  KEY `fk_solicitudes_membresia_universidades1_idx` (`iduniversidad`),
  KEY `fk_solicitudes_membresia_estado_solicitud1_idx` (`idestado_solicitud`),
  KEY `fk_solicitudes_membresia_users1_idx` (`revisado_por`),
  KEY `fk_solicitudes_membresia_equipo_miembros1_idx` (`idequipo_miembro`),
  CONSTRAINT `fk_solicitudes_membresia_equipo_miembros1` FOREIGN KEY (`idequipo_miembro`) REFERENCES `equipo_miembros` (`idequipo_miembro`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitudes_membresia_estado_solicitud1` FOREIGN KEY (`idestado_solicitud`) REFERENCES `estado_solicitud` (`idestado_solicitud`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitudes_membresia_grado_academico1` FOREIGN KEY (`id_grado_academico`) REFERENCES `grado_academico` (`id_grado_academico`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitudes_membresia_personas1` FOREIGN KEY (`idpersonas`) REFERENCES `personas` (`idpersonas`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitudes_membresia_tipos_membresia1` FOREIGN KEY (`idtipo_membresia`) REFERENCES `tipos_membresia` (`idtipo_membresia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitudes_membresia_universidades1` FOREIGN KEY (`iduniversidad`) REFERENCES `universidades` (`iduniversidad`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_solicitudes_membresia_users1` FOREIGN KEY (`revisado_por`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_membresia`
--

LOCK TABLES `solicitudes_membresia` WRITE;
/*!40000 ALTER TABLE `solicitudes_membresia` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_membresia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_evento`
--

DROP TABLE IF EXISTS `tipos_evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_evento` (
  `idtipo_evento` int(11) NOT NULL AUTO_INCREMENT,
  `nom_tipo_evento` varchar(70) NOT NULL,
  PRIMARY KEY (`idtipo_evento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_evento`
--

LOCK TABLES `tipos_evento` WRITE;
/*!40000 ALTER TABLE `tipos_evento` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipos_evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_logro`
--

DROP TABLE IF EXISTS `tipos_logro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_logro` (
  `idtipos_logro` int(11) NOT NULL AUTO_INCREMENT,
  `nom_tipo_logro` varchar(70) NOT NULL,
  PRIMARY KEY (`idtipos_logro`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_logro`
--

LOCK TABLES `tipos_logro` WRITE;
/*!40000 ALTER TABLE `tipos_logro` DISABLE KEYS */;
INSERT INTO `tipos_logro` VALUES (1,'Premio'),(2,'Publicacion'),(3,'Certificacion'),(4,'Reconocimiento'),(5,'Otro');
/*!40000 ALTER TABLE `tipos_logro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_membresia`
--

DROP TABLE IF EXISTS `tipos_membresia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_membresia` (
  `idtipo_membresia` int(11) NOT NULL AUTO_INCREMENT,
  `nom_tipo_membresia` varchar(80) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `moneda` varchar(20) NOT NULL,
  `idprioridad_pago` int(11) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`idtipo_membresia`),
  KEY `fk_tipos_membresia_prioridad_pago1_idx` (`idprioridad_pago`),
  CONSTRAINT `fk_tipos_membresia_prioridad_pago1` FOREIGN KEY (`idprioridad_pago`) REFERENCES `prioridad_pago` (`idprioridad_pago`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_membresia`
--

LOCK TABLES `tipos_membresia` WRITE;
/*!40000 ALTER TABLE `tipos_membresia` DISABLE KEYS */;
INSERT INTO `tipos_membresia` VALUES (1,'Membresía Regular','Cuota de mantenimiento de la Red. Monto confirmado en el Drive (USD 50); periodicidad pendiente de confirmar con la administracion.',50.00,'USD',1,1,'2026-09-13 05:07:42','2026-09-13 05:07:42');
/*!40000 ALTER TABLE `tipos_membresia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_publicacion`
--

DROP TABLE IF EXISTS `tipos_publicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_publicacion` (
  `idtipo_publicacion` int(11) NOT NULL AUTO_INCREMENT,
  `nom_tipo_publicacion` varchar(70) NOT NULL,
  PRIMARY KEY (`idtipo_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_publicacion`
--

LOCK TABLES `tipos_publicacion` WRITE;
/*!40000 ALTER TABLE `tipos_publicacion` DISABLE KEYS */;
INSERT INTO `tipos_publicacion` VALUES (1,'Libro'),(2,'Artículo'),(3,'Acta');
/*!40000 ALTER TABLE `tipos_publicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_redes`
--

DROP TABLE IF EXISTS `tipos_redes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_redes` (
  `idtipos_redes` int(11) NOT NULL AUTO_INCREMENT,
  `tipos_redes` varchar(50) NOT NULL,
  PRIMARY KEY (`idtipos_redes`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_redes`
--

LOCK TABLES `tipos_redes` WRITE;
/*!40000 ALTER TABLE `tipos_redes` DISABLE KEYS */;
INSERT INTO `tipos_redes` VALUES (1,'Sitio web'),(2,'Facebook'),(3,'Instagram'),(4,'X (Twitter)'),(5,'LinkedIn'),(6,'YouTube'),(7,'TikTok'),(8,'WhatsApp'),(9,'Telegram'),(10,'Pinterest'),(11,'Snapchat'),(12,'Twitch'),(13,'Discord'),(14,'Threads');
/*!40000 ALTER TABLE `tipos_redes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `universidades`
--

DROP TABLE IF EXISTS `universidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `universidades` (
  `iduniversidad` int(11) NOT NULL AUTO_INCREMENT,
  `siglas` varchar(45) NOT NULL,
  `nom_universidad` text NOT NULL,
  `idpais` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`iduniversidad`),
  KEY `fk_universidades_pais1_idx` (`idpais`),
  CONSTRAINT `fk_universidades_pais1` FOREIGN KEY (`idpais`) REFERENCES `pais` (`idpais`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `universidades`
--

LOCK TABLES `universidades` WRITE;
/*!40000 ALTER TABLE `universidades` DISABLE KEYS */;
INSERT INTO `universidades` VALUES (1,'Consultor independiente','Consultor independiente',3,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(2,'Instituto de Investigaciones sobre la Un','Instituto de Investigaciones sobre la Universidad y la Educación (UNAM)',7,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(3,'Liceo Nro 3','Liceo Nro 3',9,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(4,'UCP','UCP',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(5,'Universidad Autónoma De Baja California ','Universidad Autónoma De Baja California Sur',7,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(6,'Universidad Autónoma De Manizales','Universidad Autónoma De Manizales',5,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(7,'Universidad Autónoma del Estado De Morel','Universidad Autónoma del Estado De Morelos',7,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(8,'Universidad Católica de Cuenca','Universidad Católica de Cuenca',6,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(9,'Universidad César Vallejo','Universidad César Vallejo',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(10,'Universidad De Magallanes','Universidad De Magallanes',4,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(11,'Universidad Mayor De San Simón','Universidad Mayor De San Simón',2,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(12,'Universidad Minuto De Dios','Universidad Minuto De Dios',5,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(13,'Universidad Nacional Agraria La Molina','Universidad Nacional Agraria La Molina',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(14,'Universidad Nacional Autónoma de Tayacaj','Universidad Nacional Autónoma de Tayacaja Daniel Hernández Morillo',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(15,'Universidad Nacional De Moquegua','Universidad Nacional De Moquegua',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(16,'Universidad Nacional De Santiago Del Est','Universidad Nacional De Santiago Del Estero',1,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(17,'Universidad Nacional De Trujillo','Universidad Nacional De Trujillo',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(18,'Universidad Nacional Del Santa','Universidad Nacional Del Santa',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(19,'Universidad Nacional José María Arguedas','Universidad Nacional José María Arguedas',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(20,'Universidad Nacional Mayor de San Marcos','Universidad Nacional Mayor de San Marcos',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(21,'Universidad Nacional Micaela Bastidas De','Universidad Nacional Micaela Bastidas De Apurimac',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(22,'Universidad Nacional Toribio Rodríguez D','Universidad Nacional Toribio Rodríguez De Mendoza De Amazonas',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(23,'Universidad Nacional de Jaén','Universidad Nacional de Jaén',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(24,'Universidad Nacional de Piura','Universidad Nacional de Piura',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(25,'Universidad Privada Norbert Wiener','Universidad Privada Norbert Wiener',8,'2026-09-13 05:09:18','2026-09-13 05:09:18'),(26,'Universidad Tecnológica del Perú','Universidad Tecnológica del Perú',8,'2026-09-13 05:09:18','2026-09-13 05:09:18');
/*!40000 ALTER TABLE `universidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `idpersonas` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `fk_users_personas1_idx` (`idpersonas`),
  CONSTRAINT `fk_users_personas1` FOREIGN KEY (`idpersonas`) REFERENCES `personas` (`idpersonas`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,13,'Judith Soledad Yangali Vicente','judithsyv@gmail.com',NULL,'7e85524929392b1da378c784fd4da93af06c2a9225adc9f938b06185a5011cbd',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_roles`
--

DROP TABLE IF EXISTS `usuario_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_roles` (
  `users_id` bigint(20) unsigned NOT NULL,
  `roles_idroles` int(11) NOT NULL,
  PRIMARY KEY (`users_id`,`roles_idroles`),
  KEY `fk_users_has_roles_roles1_idx` (`roles_idroles`),
  KEY `fk_users_has_roles_users1_idx` (`users_id`),
  CONSTRAINT `fk_users_has_roles_roles1` FOREIGN KEY (`roles_idroles`) REFERENCES `roles` (`idroles`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_roles_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_roles`
--

LOCK TABLES `usuario_roles` WRITE;
/*!40000 ALTER TABLE `usuario_roles` DISABLE KEYS */;
INSERT INTO `usuario_roles` VALUES (1,1);
/*!40000 ALTER TABLE `usuario_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitas_web`
--

DROP TABLE IF EXISTS `visitas_web`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitas_web` (
  `idvisitas_web` int(11) NOT NULL AUTO_INCREMENT,
  `idempresa_kuelap` int(11) NOT NULL,
  `pagina_visitada` varchar(300) NOT NULL,
  `direccion_ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `users_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idvisitas_web`),
  KEY `fk_visitas_web_empresa_kuelap1_idx` (`idempresa_kuelap`),
  KEY `fk_visitas_web_users1_idx` (`users_id`),
  CONSTRAINT `fk_visitas_web_empresa_kuelap1` FOREIGN KEY (`idempresa_kuelap`) REFERENCES `empresa_kuelap` (`idempresa_kuelap`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_visitas_web_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas_web`
--

CREATE TABLE imagenes (
  `idimagenes` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `imagen` VARCHAR(255) NOT NULL,
  `orden` INT DEFAULT 0,
  `idempresa_kuelap` INT NOT NULL,
  CONSTRAINT `fk_imagenes_empresa_kuelap` 
    FOREIGN KEY (`idempresa_kuelap`) 
    REFERENCES `empresa_kuelap` (`idempresa_kuelap`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

LOCK TABLES `visitas_web` WRITE;
/*!40000 ALTER TABLE `visitas_web` DISABLE KEYS */;
/*!40000 ALTER TABLE `visitas_web` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'kuelap'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-13  0:47:56
