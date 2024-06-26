﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using back;

#nullable disable

namespace back.Migrations
{
    [DbContext(typeof(LoginContext))]
    [Migration("20240608204315_InitialMigrationLogin")]
    partial class InitialMigrationLogin
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.5");

            modelBuilder.Entity("back.Login", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<decimal>("BudgetGoalAmount")
                        .HasColumnType("TEXT");

                    b.Property<string>("BudgetGoalDescription")
                        .HasColumnType("TEXT");

                    b.Property<string>("BudgetGoalTitle")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<decimal>("GoalSavingsBalance")
                        .HasColumnType("TEXT");

                    b.Property<decimal>("InitialSavingsBalance")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("base64Credentials")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("hash")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Logins");
                });
#pragma warning restore 612, 618
        }
    }
}
