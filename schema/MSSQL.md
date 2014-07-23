Example MSSQL DB for testing
===

VSAA uses very simple SQL Schema for data storage. It utilizes two tables, one for applications to store credentials and one for actual event data. Below you can find SQL CREATE script for preparing the database structure for vsaa.

SQL Create script
---

CREATE DATABASE "VSAA" COLLATE Latin1_General_CS_AS ;
GO

USE "VSAA"
GO

/****** Object:  Table [dbo].[Applications]    Script Date: 19/07/2014 20:13:51 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Applications](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](64) NOT NULL,
	[ApiKey] [varchar](64) NOT NULL,
	[ApiSecret] [varchar](64) NOT NULL,
	[ApiSalt] [varchar](64) NOT NULL,
 CONSTRAINT [PK_Applications] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


/****** Object:  Table [dbo].[Events]    Script Date: 19/07/2014 20:17:53 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Events](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DeviceIdentifier] [varchar](128) NOT NULL,
	[Description] [varchar](255) NOT NULL,
	[Logged] [timestamp] NOT NULL,
	[Applications_Id] [int] NOT NULL,
 CONSTRAINT [PK_Events] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


