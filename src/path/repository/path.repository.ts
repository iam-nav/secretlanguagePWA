import { EntityRepository, Repository } from 'typeorm';
import { Path } from '../entity/path.entity';

@EntityRepository(Path)
export class PathRepository extends Repository<Path> {}
