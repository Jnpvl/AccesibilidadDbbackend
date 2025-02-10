import { 
    BaseEntity, 
    Column, 
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
  } from "typeorm";
    
  @Entity("usuarios")
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    role!: string;
  
    @Column()
    Name!: string;

    @Column()
    ApellidoP!: string;

    @Column()
    ApellidoM!: string;
  
    @Column({ unique: true })
    username!: string;
  
    @Column()
    password!: string;
  
    @Column({ default: 'active' })
    status!: string;
  
    // Usar 'datetime' (o 'datetime2') en lugar de 'timestamp'
    @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
    created_at!: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
    updated_at!: Date;
  
    @DeleteDateColumn({ type: 'datetime', nullable: true })
    deleted_at?: Date;
  
    @Column({ default: false })
    canExportExcel!: boolean;
  
    @Column({ default: false })
    canExportPdf!: boolean;
  
    @Column({ default: true })
    canCreateUser!: boolean;
  }
  