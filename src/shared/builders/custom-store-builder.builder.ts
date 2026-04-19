import { DataService } from '../interfaces'
import { buildCustomStore, CustomStoreLike } from '../utils/custom-store.util'

export const customStoreBuilder = <T>(service: DataService<T>, keyField: string): CustomStoreLike<T> => {
    return buildCustomStore(service, keyField)
}
