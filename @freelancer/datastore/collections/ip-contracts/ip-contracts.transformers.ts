import { IpContractApi } from 'api-typings/projects/projects';
import { IpContract } from './ip-contracts.model';

export function transformIpContract(ipContract: IpContractApi): IpContract {
  return {
    // this is done because contracts live in two different tables (employer and freelancers)
    id: `${ipContract.project_id}-${ipContract.user_id}`,
    signed: ipContract.signed,
    projectId: ipContract.project_id,
    userId: ipContract.user_id,
  };
}
