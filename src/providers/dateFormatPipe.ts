import {Injectable, Pipe, PipeTransform} from "@angular/core";
import format from "date-fns/format";

@Pipe({
  name: 'dateformat'
})

@Injectable()
export class DateFormatPipe implements PipeTransform {
  transform(d: Date | string, fmt: string): string {
    let rv = format(d, fmt);
    return rv;
  }
}