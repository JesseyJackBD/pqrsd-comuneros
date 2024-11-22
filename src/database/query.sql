CREATE DATABASE pqrsd;

USE pqrsd;

BEGIN;
CREATE TABLE IF NOT EXISTS categorias (
	id_categoria INT AUTO_INCREMENT,
	nombre_categoria VARCHAR(255),
	descripcion_categoria TEXT,
	PRIMARY KEY (id_categoria)
);
CREATE TABLE IF NOT EXISTS empresas (
	id_empresa INT AUTO_INCREMENT,
	nombre_empresa VARCHAR(255),
	descripcion_empresa TEXT,
	telefono_empresa VARCHAR(255),
	correo_empresa VARCHAR(255),
	PRIMARY KEY (id_empresa)
);
CREATE TABLE IF NOT EXISTS estados (
	id_estado INT AUTO_INCREMENT,
	nombre_estado VARCHAR(255),
	descripcion_estado TEXT,
	PRIMARY KEY (id_estado)
);
CREATE TABLE IF NOT EXISTS despachados (
	id_despachado INT AUTO_INCREMENT,
	nombre_despachado VARCHAR(255),
	PRIMARY KEY (id_despachado)
);
CREATE TABLE IF NOT EXISTS estados_locales (
  id_estado_local INT AUTO_INCREMENT,
  nombre_estado VARCHAR(255),
  descripcion_estado VARCHAR(255),
  PRIMARY KEY (id_estado_local)
);
CREATE TABLE IF NOT EXISTS administradores (
  id_administrador INT AUTO_INCREMENT,
  nombre_administrador VARCHAR(255),
	email VARCHAR(255),
	password VARCHAR(255),
  PRIMARY KEY (id_administrador)
);
CREATE TABLE IF NOT EXISTS usuarios (
	id_usuario INT,
	nombre_usuario VARCHAR(255),
	telefono_usuario VARCHAR(255),
	correo_usuario VARCHAR(255),
	PRIMARY KEY (id_usuario)
);
CREATE TABLE IF NOT EXISTS locales (
  id_local INT,
  id_usuario VARCHAR(255),
  id_estado_local INT,
  nombre_local VARCHAR(255),
  descripcion_local VARCHAR(255),
  PRIMARY KEY (id_local),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_estado_local) REFERENCES estados_locales(id_estado_local)
);
CREATE TABLE IF NOT EXISTS pqrsds (
	id_pqrsd INT,
	id_local INT,
	id_categoria INT,
	id_estado INT,
	id_administrador INT,
	id_despachado INT,
	fecha VARCHAR(255),
	asunto TEXT,
	PRIMARY KEY (id_pqrsd),
	FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
	FOREIGN KEY (id_estado) REFERENCES estados(id_estado),
	FOREIGN KEY (id_local) REFERENCES locales(id_local),
	FOREIGN KEY (id_administrador) REFERENCES administradores(id_administrador),
	FOREIGN KEY (id_despachado) REFERENCES despachados(id_despachado)
);
CREATE TABLE IF NOT EXISTS externo (
	id_externo INT,
	id_empresa INT,
	id_categoria INT,
	id_estado INT,
	id_administrador INT,
	id_despachado INT,
	fecha VARCHAR(255),
	asunto TEXT,
	PRIMARY KEY (id_externo),
	FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
	FOREIGN KEY (id_estado) REFERENCES estados(id_estado),
	FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
	FOREIGN KEY (id_administrador) REFERENCES administradores(id_administrador),
	FOREIGN KEY (id_despachado) REFERENCES despachados(id_despachado)
);
COMMIT;

ALTER TABLE administradores ADD COLUMN email VARCHAR(255);
ALTER TABLE administradores ADD COLUMN password VARCHAR(255);
ALTER TABLE administradores DROP COLUMN descripcion_administrador;


SELECT * FROM usuarios;


INSERT INTO categorias VALUES (1,'Peticion','Solicitud verbal o escrita que presenta una persona natural o juridica');
INSERT INTO categorias VALUES (2,'Quejas','Inconformidad por parte de una persona, ya sea de carácter administrativa o por conductas no deseables de los colaboradores');
INSERT INTO categorias VALUES (3,'Reclamos','Inconformidad sobre la prestación de un servicio');
INSERT INTO categorias VALUES (4,'Sugerencias','Es la propuesta que presenta el usuario para el mejoramiento de un proceso');
INSERT INTO categorias VALUES (5,'Denuncias','Manifestación de inconformidad que considera irregular de uno o varios servidores públicos en desarrollo de sus funciones.');

INSERT INTO empresas VALUES (1,'Comuneros','Centro Comercial',3112020869,'ccpopularloscomuneros@gmail.com');
INSERT INTO empresas VALUES (2,'Electrohuila','Central Electrical del Huila',6088664600,'radicacion@electrohuila.co');
INSERT INTO empresas VALUES (3,'Seguros Bolivar','Empresa de seguros',3223322322,'notificaciones@segurosbolivar.com');
INSERT INTO empresas VALUES (4,'Ciudad Limpia','Empresa tratamiento de residuos',6088664464,'jgiraldo.eco@ciudadlimpia.com');

INSERT INTO estados VALUES (1,'Abierto','Llega un nuevo pqrsd');
INSERT INTO estados VALUES (2,'Pendiente','Aun no se responde el pqrsd');
INSERT INTO estados VALUES (3,'En espera','Esperando respuesta de un ente externo');
INSERT INTO estados VALUES (4,'Resuelto','Resuelto el pqrsd');

INSERT INTO estados_locales VALUES (1,'Activo','Local en uso');
INSERT INTO estados_locales VALUES (2,'Inactivo','Local inactivo');

INSERT INTO administradores VALUES (1,'Juan Carlos Segura','Gerente Administrativo');
INSERT INTO administradores VALUES (2,'Lorena','Recepcion');

INSERT INTO usuarios VALUES (26427749,'REBECA MOSQUERA MEDINA',3208146410,'rebeca@gmail.com');
INSERT INTO usuarios VALUES (36148159,'MIRYAM MADRIGAL DE SANTOS',3281464100,'miryam@gmail.com');
INSERT INTO usuarios VALUES (38231313,'FLOR ALBA ROJAS DE CANDIL',3264100814,'alba@gmail.com');
INSERT INTO usuarios VALUES (1075223106,'EVA CAROLINA CARVAJAL ROJAS ',3214641008,'eva@gmail.com');

INSERT INTO locales VALUES (1001,26427749, 1, 'Local ROJAS ', 'Venta de rojas');
INSERT INTO locales VALUES (1002,36148159, 2, 'Local SANTOS ', 'Venta de santos');
INSERT INTO locales VALUES (1003,1075223106, 1, 'Local CARVAJAL ', 'Venta de carvajal');
INSERT INTO locales VALUES (1004,38231313, 2, 'Local CANDIL ', 'Venta de candil');

INSERT INTO pqrsds VALUES (54, 1001, 2, 2, 1, '2024-08-22','Queja de precio');
INSERT INTO pqrsds VALUES (987, 1002, 4, 3, 2,'2024-08-22','Sugiere horario de cierre');
INSERT INTO pqrsds VALUES (2134, 1003, 1, 1, 1,'2024-08-22','Solicita activacion de electricidad');
INSERT INTO pqrsds VALUES (32547, 1004, 3, 3, 2,'2024-08-22','Reclama falta de aseo');

INSERT INTO externo VALUES (32547, 2, 3, 3, 2,'2024-08-22','Reclama falta de aseo');
INSERT INTO externo VALUES (10, 2, 3, 2, 2,'2024-08-22','Reclama falta de aseo');

INSERT INTO despachados VALUES (1, 'No despachado');
INSERT INTO despachados VALUES (2, 'Despachado Fisico');
INSERT INTO despachados VALUES (3, 'Despachado Digital');
INSERT INTO despachados VALUES (4, 'Despachado Fisico y Digital');

mysql://root:BUvTbLbkluDqbixagGPPFUHwSAxXhreJ@junction.proxy.rlwy.net:26950/railway

UPDATE pqrsds SET id_categoria = 1 WHERE id_pqrsd = 54;

SELECT id_pqrsd, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto, nombre_empresa FROM pqrsds 
INNER JOIN usuarios ON pqrsds.id_usuario = usuarios.id_usuario
INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria 
INNER JOIN estados ON pqrsds.id_estado = estados.id_estado
INNER JOIN empresas ON usuarios.id_empresa = empresas.id_empresa;

SELECT id_pqrsd, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds 
INNER JOIN usuarios ON pqrsds.id_usuario = usuarios.id_usuario 
INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria 
INNER JOIN estados ON pqrsds.id_estado = estados.id_estado;

SELECT nombre_empresa FROM pqrsds 
INNER JOIN usuarios ON pqrsds.id_usuario = usuarios.id_usuario
INNER JOIN empresas ON usuarios.id_empresa = empresas.id_empresa;


SELECT id_pqrsd, pqrsds.id_local, nombre_administrador, nombre_usuario, nombre_categoria, nombre_estado,  fecha, asunto FROM pqrsds 
INNER JOIN locales ON pqrsds.id_local = locales.id_local
INNER JOIN usuarios ON locales.id_usuario = usuarios.id_usuario 
INNER JOIN administradores ON pqrsds.id_administrador = administradores.id_administrador
INNER JOIN categorias ON pqrsds.id_categoria = categorias.id_categoria 
INNER JOIN estados ON pqrsds.id_estado = estados.id_estado;