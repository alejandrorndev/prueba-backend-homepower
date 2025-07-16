import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity()


export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    nombre: string;
  
    @Column('decimal')
    precio: number;
  
    @Column('int')
    stock: number;

    @CreateDateColumn({ 
      type: 'timestamp', 
      default: () => 'CURRENT_TIMESTAMP', 
      name: 'created_at'
    })
    createdAt: Date;
  
    @UpdateDateColumn({ 
      type: 'timestamp', 
      default: () => 'CURRENT_TIMESTAMP', 
      onUpdate: 'CURRENT_TIMESTAMP', 
      name: 'updated_at'
    })
    updatedAt: Date;
  }