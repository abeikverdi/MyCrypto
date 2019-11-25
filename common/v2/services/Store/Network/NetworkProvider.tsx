import React, { Component, createContext } from 'react';
import * as service from './Network';
import { Network, ExtendedNetwork, NodeOptions } from 'v2/types';

export interface ProviderState {
  networks: ExtendedNetwork[];
  createNetwork(networksData: ExtendedNetwork): void;
  readNetwork(uuid: string): Network;
  deleteNetwork(uuid: string): void;
  createNetworksNode(uuid: string, nodeData: NodeOptions): void;
  updateNetwork(uuid: string, networksData: ExtendedNetwork): void;
  getNetworkByName(name: string): Network | undefined;
}

export const NetworkContext = createContext({} as ProviderState);

export class NetworkProvider extends Component {
  public readonly state: ProviderState = {
    networks: service.readNetworks() || [],
    createNetwork: (networksData: ExtendedNetwork) => {
      service.createNetwork(networksData);
      this.getNetworks();
    },
    readNetwork: (uuid: string) => {
      return service.readNetwork(uuid);
    },
    deleteNetwork: (uuid: string) => {
      service.deleteNetwork(uuid);
      this.getNetworks();
    },
    createNetworksNode: (uuid: string, nodeData: NodeOptions) => {
      const networkCurrentData: Network = service.readNetwork(uuid);
      const newNetworkData: Network = {
        ...networkCurrentData,
        nodes: [...networkCurrentData.nodes, nodeData]
      };
      service.updateNetwork(uuid, newNetworkData);
      this.getNetworks();
    },
    updateNetwork: (uuid: string, networksData: ExtendedNetwork) => {
      service.updateNetwork(uuid, networksData);
      this.getNetworks();
    },
    getNetworkByName: (name: string): Network | undefined => {
      const { networks } = this.state;
      return networks.find((network: Network) => network.name === name);
    }
  };

  public render() {
    const { children } = this.props;
    return <NetworkContext.Provider value={this.state}>{children}</NetworkContext.Provider>;
  }

  private getNetworks = () => {
    const networks: ExtendedNetwork[] = service.readNetworks() || [];
    this.setState({ networks });
  };
}
