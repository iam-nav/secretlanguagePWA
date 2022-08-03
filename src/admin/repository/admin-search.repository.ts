import { AdminRecentSearch } from '../entity/admin-search.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AdminRecentSearch)
export class AdminRecentSearchRepository extends Repository<AdminRecentSearch> {}
