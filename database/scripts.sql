USE [UNIFIED_INTERFACE]
GO

/****** Object:  StoredProcedure [Seguridad].[InsertarUsuario]    Script Date: 8/11/2024 07:36:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [Seguridad].[InsertarUsuario]
    @IdEmpresa INT,
    @CodUsuario NVARCHAR(30),
    @Nombres NVARCHAR(50),
    @Apellidos NVARCHAR(50),
    @Contrasena NVARCHAR(250),
    @Correo_Electronico NVARCHAR(150) = NULL,
    @RolId INT = NULL,
    @AreaId INT = NULL,
    @Autenticacion BIT = NULL,
    @EmpleadoId INT = NULL,
    @Intentos_Fallidos INT = 0,
    @Bloqueado BIT = 0,
    @Sesion_Iniciada BIT = 0,
    @Multiple_Sesion BIT = 0,
    @Cambiar_Password_Logon BIT = 0,
    @Contrasena_Caduca BIT = 0,
    @Version_Sistema INT = NULL,
    @Fecha_Contrasena DATETIME = NULL,
    @Usuario_Creacion NVARCHAR(30),
    @Equipo_Creacion NVARCHAR(50),
    @Estado BIT = 1
AS
BEGIN
    INSERT INTO [Seguridad].[Usuario] (
        [IdEmpresa], [CodUsuario], [Nombres], [Apellidos], [Contrasena], 
        [Correo_Electronico], [RolId], [AreaId], [Autenticacion], [EmpleadoId], 
        [Intentos_Fallidos], [Bloqueado], [Sesion_Iniciada], [Multiple_Sesion], 
        [Cambiar_Password_Logon], [Contrasena_Caduca], [Version_Sistema], 
        [Fecha_Contrasena], [Usuario_Creacion], [Fecha_Creacion], 
        [Equipo_Creacion], [Estado]
    ) 
    VALUES (
        @IdEmpresa, @CodUsuario, @Nombres, @Apellidos, @Contrasena, 
        @Correo_Electronico, @RolId, @AreaId, @Autenticacion, @EmpleadoId, 
        @Intentos_Fallidos, @Bloqueado, @Sesion_Iniciada, @Multiple_Sesion, 
        @Cambiar_Password_Logon, @Contrasena_Caduca, @Version_Sistema, 
        @Fecha_Contrasena, @Usuario_Creacion, GETDATE(), -- Aquí se asigna la fecha del servidor
        @Equipo_Creacion, @Estado
    );
END;
GO


CREATE PROCEDURE [Seguridad].[ConsultarUsuario]
    @Correo_Electronico NVARCHAR(150),
    @Contrasena NVARCHAR(250)
AS
BEGIN
    SELECT 
        [IdUsuario],
        [IdEmpresa],
        [CodUsuario],
        [Nombres],
        [Apellidos],
        [Correo_Electronico],
        [RolId],
        [AreaId],
        [EmpleadoId],
        [Intentos_Fallidos],
        [Bloqueado],
        [Sesion_Iniciada],
        [Multiple_Sesion],
        [Contrasena_Caduca],
        [Fecha_Creacion],
        [Fecha_Modifica],
        [Estado]
    FROM 
        [Seguridad].[Usuario]
    WHERE 
        [Correo_Electronico] = @Correo_Electronico
        AND [Contrasena] = @Contrasena
        AND [Estado] = 1;  -- Verifica que el usuario esté activo
END;


GO