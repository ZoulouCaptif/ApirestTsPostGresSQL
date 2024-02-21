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

  @Property()
  hide:boolean

  constructor(name: string, date: string, status:boolean, hide:boolean) {
    this.name = name;
    this.date = date;
    this.status = status;
    this.hide = hide;
  }
}

