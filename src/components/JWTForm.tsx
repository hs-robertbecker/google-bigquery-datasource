import React from 'react';
import { Button, Field, Input, Tooltip } from '@grafana/ui';
import { BigQueryOptions } from 'types';
import { TEST_IDS } from 'utils/testIds';

interface JWTFormProps {
  options: BigQueryOptions;
  onReset: () => void;
  onChange: (key: keyof BigQueryOptions) => (e: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

enum PrivateKeyConfig {
  PATH = "path",
  JWT = 'jwt'
}

const getInitialPrivateKeyConfig = (options: BigQueryOptions): PrivateKeyConfig => {
  return 'privateKeyFile' in options && options.privateKeyFile !== ''
    ? PrivateKeyConfig.PATH
    : PrivateKeyConfig.JWT
}

export const JWTForm: React.FC<JWTFormProps> = ({ options, onReset, onChange }) => {
  const [privateKeyConfig, setPrivateKeyConfig] = React.useState<PrivateKeyConfig>(getInitialPrivateKeyConfig(options))

  const togglePrivateKeyFields = (): void => {
    if (privateKeyConfig === PrivateKeyConfig.JWT) {
      setPrivateKeyConfig(PrivateKeyConfig.PATH)
    } else {
      setPrivateKeyConfig(PrivateKeyConfig.JWT)
    }
  }

  return (
    <div data-testid={TEST_IDS.jwtForm}>
      <Field label="Project ID">
        {/* @ts-ignore */}
        <Input
          id="defaultProject"
          width={60}
          value={options.defaultProject || ''}
          onChange={onChange('defaultProject')}
        />
      </Field>

      <Field label="Client email">
        {/* @ts-ignore */}
        <Input width={60} id="clientEmail" value={options.clientEmail || ''} onChange={onChange('clientEmail')} />
      </Field>

      <Field label="Token URI">
        {/* @ts-ignore */}
        <Input width={60} id="tokenUri" value={options.tokenUri || ''} onChange={onChange('tokenUri')} />
      </Field>

      {
        privateKeyConfig === PrivateKeyConfig.PATH && (
          <Field
            label="Private key path"
            description="File location of your private key (e.g. /etc/secrets/bigquery.pem)"
          >
            {/* @ts-ignore */}
            <Input width={60} id="privateKeyPath" value={options.privateKeyFile || ''} onChange={onChange('privateKeyFile')} />
          </Field>
        )
      }

      {
        privateKeyConfig === PrivateKeyConfig.JWT && (
          <Field
            label="Private key"
            description={<span>Paste private key or <a className="external-link" onClick={togglePrivateKeyFields}>provide path to private file</a></span>}
            disabled
          >
            {/* @ts-ignore */}
            <Input
              width={60}
              id="privateKey"
              readOnly
              placeholder={options.privateKeyFile === '' ? "Private key configured" : ""}
              addonAfter={
                <Tooltip content="Click to clear the uploaded JWT token and upload a new one">
                  <Button data-testid={TEST_IDS.resetJwtButton} icon="sync" size="xs" onClick={onReset} fill="outline">
                    Reset token
                  </Button>
                </Tooltip>
              }
            />
          </Field>
        )
      }
    </div>
  );
};
