import { Entity, PrimaryKey, Property} from '@mikro-orm/better-sqlite';

@Entity()
export class Task {

  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property()
  date: string;

  @Property()
  status:boolean

  constructor(name: string, date: string, status:boolean, hide:boolean) {
    this.name = name;
    this.date = date;
    this.status = status;
  }
}

