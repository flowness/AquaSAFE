import { Injectable, Pipe, PipeTransform } from "@angular/core";
import parse from "date-fns/parse";

@Pipe({
  name: 'dateparse'
})

@Injectable()
export class DateParsePipe implements PipeTransform {
  transform(s: string): Date {
    let rv = parse(s, "dd-MM-yyyy HH:mm", new Date());
    return rv;
  }
}