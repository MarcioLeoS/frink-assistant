<?php
$cfg['Servers'] = [];

// Servidor 1: Base de datos de n8n (con usuario n8n)
$i = 1;
$cfg['Servers'][$i]['host'] = 'mysql';
$cfg['Servers'][$i]['port'] = '3306';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['verbose'] = 'N8N Database (n8n_db)';
$cfg['Servers'][$i]['only_db'] = array('n8n_db');

// Servidor 2: Base de datos de Frink App
$i++;
$cfg['Servers'][$i]['host'] = 'mysql';
$cfg['Servers'][$i]['port'] = '3306';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['verbose'] = 'Frink App (frink_assistant_db)';
$cfg['Servers'][$i]['only_db'] = array('frink_assistant_db');

// Servidor 3: Acceso root (todas las bases)
$i++;
$cfg['Servers'][$i]['host'] = 'mysql';
$cfg['Servers'][$i]['port'] = '3306';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['verbose'] = 'Root - Todas las bases';

// Permitir login arbitrario (puedes usar root si es necesario)
$cfg['AllowArbitraryServer'] = false;
$cfg['LoginCookieValidity'] = 86400;

// Configuración de seguridad adicional
$cfg['LoginCookieRecall'] = false; // No recordar usuario
$cfg['ShowPhpInfo'] = false; // Ocultar info de PHP
$cfg['ShowServerInfo'] = false; // Ocultar versión de MySQL
$cfg['VersionCheck'] = false; // No verificar versión públicamente

// Límites de seguridad
$cfg['ExecTimeLimit'] = 300; // 5 minutos máximo
$cfg['MemoryLimit'] = '256M';
$cfg['ZipDump'] = true; // Permitir compresión
$cfg['GZipDump'] = true;